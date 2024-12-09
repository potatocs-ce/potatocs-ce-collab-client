import { Component, HostListener, Inject, Input, OnInit, ViewChild, WritableSignal, effect } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DocumentsService } from "../../../../services/spaces/documents.service";
import { ActivatedRoute } from "@angular/router";
import { MemberDataStorageService } from "../../../../stores/member-data-storage/member-data-storage.service";
import { DialogService } from "../../../../stores/dialog/dialog.service";
import { MaterialsModule } from "../../../../materials/materials.module";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-meeting-set",
	standalone: true,
	imports: [MaterialsModule, CommonModule],
	templateUrl: "./meeting-set.component.html",
	styleUrl: "./meeting-set.component.scss",
})
export class MeetingSetComponent {
	today = new Date();
	// defaultHour: String = String(this.today.getHours() + 1);

	setMeetingForm = new FormGroup({
		startDate: new FormControl(this.today),
		meetingTitle: new FormControl(),
		meetingDescription: new FormControl(),
		startHour: new FormControl("12"),
		startMin: new FormControl("00"),
		startUnit: new FormControl("PM"),
	});

	hourList = [
		{ value: "1" },
		{ value: "2" },
		{ value: "3" },
		{ value: "4" },
		{ value: "5" },
		{ value: "6" },
		{ value: "7" },
		{ value: "8" },
		{ value: "9" },
		{ value: "10" },
		{ value: "11" },
		{ value: "12" },
	];
	minList = [{ value: "00" }, { value: "15" }, { value: "30" }, { value: "45" }];
	timeUnit = [{ value: "PM" }, { value: "AM" }];

	spaceId;
	enlistedMember = [];
	enlistedMemberName = [];
	private unsubscribe$ = new Subject<void>();
	member: WritableSignal<any> = this.mdsService.member;
	constructor(
		public dialogRef: MatDialogRef<MeetingSetComponent>,
		private docsService: DocumentsService,
		private route: ActivatedRoute,
		private mdsService: MemberDataStorageService,
		private dialogService: DialogService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.spaceId = data.spaceId;
		console.log(data);
		console.log(this.spaceId);

		effect(() => {
			if (this.member()) {
				for (let index = 0; index < this.member()[0].memberObjects.length; index++) {
					this.enlistedMember.push(this.member()[0].memberObjects[index]._id);
				}
			}
		});
	}

	ngOnInit(): void {
		console.log(this.today.getHours() + 1);
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	// 미팅 만들기
	createMeeting() {
		this.dialogService.openDialogConfirm("Do you want to set up a meeting?").subscribe((result) => {
			if (result) {
				// currentMember 만들기 -> 실시간 미팅에서 쓰임
				let currentMember = new Array();
				for (let index = 0; index < this.enlistedMember.length; index++) {
					const element = {
						member_id: this.enlistedMember[index],
						role: "Presenter",
						online: false,
					};
					currentMember.push(element);
				}

				const formValue = this.setMeetingForm.value;

				let setMeeting = {
					spaceId: this.spaceId,
					meetingTitle: formValue.meetingTitle,
					meetingDescription: formValue.meetingDescription,
					startDate: formValue.startDate,
					startTime: formValue.startUnit + " " + formValue.startHour + " : " + formValue.startMin,
					enlistedMembers: this.enlistedMember,
					currentMembers: currentMember,
					status: "pending",
				};
				console.log(setMeeting);

				if (setMeeting.startDate == null || setMeeting.meetingTitle == null) {
					this.dialogService.openDialogNegative("Please, check the meeting title and date.");
					// alert('Please, check the meeting title and date.');
				} else {
					this.docsService.createMeeting(setMeeting).subscribe(
						(data: any) => {
							console.log(data);
							this.dialogRef.close();
							this.dialogService.openDialogPositive("Successfully, the meeting has been set up.");
						},
						(err: any) => {
							console.log(err);
						}
					);
				}
			}
		});
	}

	// 달력 필터
	myFilter = (d: Date | null): boolean => {
		const day = (d || new Date()).getDay();
		// Prevent Saturday and Sunday from being selected.
		return day !== 0 && day !== 6;
	};
}
