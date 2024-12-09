import { Component, HostListener, Inject, Input, OnInit, ViewChild, WritableSignal, effect } from "@angular/core";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DocumentsService } from "../../../services/spaces/documents.service";
import { ActivatedRoute } from "@angular/router";
import { MemberDataStorageService } from "../../../stores/member-data-storage/member-data-storage.service";
import { CommonService } from "../../../services/common/common.service";
import { MatSnackBar } from "@angular/material/snack-bar";

//table page
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogService } from "../../../stores/dialog/dialog.service";
import { takeUntil } from "rxjs/operators";
import { fromEvent, Observable, Subject, Subscription } from "rxjs";

// env
import { environment } from "../../../../environments/environment";
import { MeetingDetailComponent } from "./meeting-detail/meeting-detail.component";
import { MeetingListStorageService } from "../../../stores/meeting-list-storage.service";
import { ProfilesService } from "../../../services/profiles/profiles.service";
import { MaterialsModule } from "../../../materials/materials.module";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MeetingSetComponent } from "./meeting-set/meeting-set.component";
//view table
export interface PeriodicElement {
	Meeting: String;
	Date: Date;
	// Time: String,
}

@Component({
	selector: "app-meeting-list",
	templateUrl: "./meeting-list.component.html",
	styleUrls: ["./meeting-list.component.scss"],
	standalone: true,
	imports: [MaterialsModule, CommonModule],
})
export class MeetingListComponent implements OnInit {
	meetingItems: any = {};
	mobileWidth: any;
	pageSize;
	pageSizeOptions;

	// 브라우저 크기 변화 체크 ///
	resizeObservable$: Observable<Event>;
	resizeSubscription$: Subscription;
	///////////////////////
	pageEvent: PageEvent;
	private API_URL = environment.apiUrl;
	private MEETING_FRONT_URL = environment.MEETING_FRONT_URL;

	@Input() spaceInfo: any;
	@Input() memberInSpace: any;
	meetingArray;
	slideArray = [];
	userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;
	meeting: WritableSignal<any> = this.meetingListStorageService.meeting;
	member: WritableSignal<any> = this.mdsService.member;
	spaceTime: any;
	displayedColumns: string[] = ["meetingTitle", "meetingDescription", "start_date", "start_time"];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	private unsubscribe$ = new Subject<void>();

	userData: any;

	constructor(
		public dialog: MatDialog,
		private docsService: DocumentsService,
		private route: ActivatedRoute,
		// private commonService: CommonService,
		private dialogService: DialogService,
		private meetingListStorageService: MeetingListStorageService,
		private snackbar: MatSnackBar,
		private profilesService: ProfilesService,
		private mdsService: MemberDataStorageService
	) {
		effect(() => {
			if (this.userProfileInfo()) {
				this.userData = this.userProfileInfo;
				if (this.meeting()) {
					this.meetingIsHost();
				}
			}
		});
	}

	ngOnInit() {}

	ngOnChanges() {
		this.spaceTime = this.route.snapshot.params["spaceTime"];
	}

	ngOnDestroy() {
		// unsubscribe all subscription

		this.unsubscribe$.next();
		this.unsubscribe$.complete();
		// this.resizeSubscription$.unsubscribe();
	}

	// 미팅 생성
	openDialogDocMeetingSet() {
		this.spaceTime = this.route.snapshot.params["spaceTime"];

		const dialogRef = this.dialog.open(MeetingSetComponent, {
			data: {
				spaceId: this.spaceTime,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("dialog close");
			// this.getMeetingList();
		});
	}

	//미팅 호스트인지 확인하고 호스트면 툴바 보이게하기
	meetingIsHost() {
		const data = this.meeting();

		this.meetingArray = this.docsService.statusInMeeting(data);

		// this.meetingArray = new MatTableDataSource<PeriodicElement>(this.meetingArray);
		// this.onResize();
		for (let i = 0; i < this.meetingArray.length; i++) {
			const hostId = this.meetingArray[i].manager;

			if (hostId == this.userData()._id) {
				this.meetingArray[i].isHost = true;
			} else {
				this.meetingArray[i].isHost = false;
			}
			for (let j = 0; j < this.memberInSpace.length; j++) {
				const memberId = this.memberInSpace[j]._id;
				if (hostId == memberId) {
					this.meetingArray[i].manager_name = this.memberInSpace[j].name;
					this.meetingArray[i].manager_profile = this.memberInSpace[j].profile_img;
				}
			}
		}
	}
	// 미팅 디테일 오픈
	openDialogMeetingDetail(data) {
		const dialogRef = this.dialog.open(MeetingDetailComponent, {
			data: {
				_id: data._id,
				spaceId: data.spaceId,
				meetingTitle: data.meetingTitle,
				meetingDescription: data.meetingDescription,
				manager: data.manager,
				createdAt: data.createdAt,
				enlistedMembers: data.enlistedMembers,
				// isDone: false,
				start_date: data.start_date,
				start_time: data.start_time,
				status: data.status,
				space_id: this.spaceTime,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			// this.getMeetingList();
		});
	}

	/* 
    Angular의 NgFor 디렉티브는 배열과 같은 컬렉션 데이터를 반복적으로 렌더링 할 때 자주 사용됩니다. NgFor 디렉티브는 컬렉션 데이터의 각 Item을 사용하여 렌더링하며 데이터가 변경되면 관련된 View를 다시 렌더링합니다.


    NgFor 디렉티브에는 기본적으로 TrackBy 옵션이 없기 때문에 Angular는 각 Item이 변경되었는지 확인하기 위해 안전하게 모든 item을 다시 렌더링합니다. 따라서 컬렉션의 크기가 커지면 렌더링 시간이 늘어나게됩니다.


    이 문제를 해결하기 위해 Angular는 TrackBy 옵션을 제공합니다. TrackBy 함수를 사용하면 Angular가 컬렉션 Item을 식별하는 데 사용되는 고유한 값이 있으면 해당 값을 기반으로 변경 내용을 감지합니다.


    즉, TrackBy 함수는 NgFor 디렉티브가 사용하는 TrackBy 인터페이스를 구현한 사용자 정의 함수입니다. TrackBy 인터페이스는 다음과 같습니다.*/
	trackById(index: number, data: any): number {
		return data._id;
	}

	toggle(meetingData, index) {
		// console.log("TOGGLE DATA >>" + data);
		// console.log("INDEX DATA >>" + index);
		// 1단계 status가 pending 일때
		if (meetingData.status == "pending") {
			this.pendingToOpen(meetingData);
		} else if (meetingData.status == "Open") {
			this.closeMeeting(meetingData);
		} else if (meetingData.status == "Close") {
			this.openMeeting(meetingData);
		}
	}

	pendingToOpen(meetingData) {
		// console.log('data status', data.status);
		let data = {
			_id: meetingData._id,
			spaceId: meetingData.spaceId,
			status: "Open",
		};
		this.docsService.openMeeting(data).subscribe(
			(data: any) => {
				console.log(data);
			},
			(err: any) => {
				console.log(err);
			}
		);
		this.snackbar.open("Meeting Open", "Close", {
			duration: 3000,
			horizontalPosition: "center",
		});
	}

	// 호스트가 미팅을 연다
	openMeeting(meetingData) {
		let data = {
			_id: meetingData._id,
			spaceId: meetingData.spaceId,
			status: "Open",
		};
		// this.isMeetingOpen = true;
		// this.flagBtn = true
		this.docsService.openMeeting(data).subscribe(
			(data: any) => {
				console.log(data);
			},
			(err: any) => {
				console.log(err);
			}
		);
		this.snackbar.open("Meeting Open", "Close", {
			duration: 3000,
			horizontalPosition: "center",
		});

		// 미팅 입장
		// this.enterMeeting();
	}

	// 호스트가 미팅을 닫는다 -> 실시간 회의만 불가능, 업로드 된 파일이나 기록 확인 가능
	closeMeeting(meetingData) {
		let data = {
			_id: meetingData._id,
			spaceId: meetingData.spaceId,
			status: "Close",
		};
		// this.isMeetingOpen = true;
		// this.flagBtn = false;
		this.docsService.closeMeeting(data).subscribe(
			(data: any) => {
				console.log(data);
			},
			(err: any) => {
				console.log(err);
			}
		);
		this.snackbar.open("Meeting close", "Close", {
			duration: 3000,
			horizontalPosition: "center",
			// verticalPosition: "top",
		});
	}
	enterMeeting(data) {
		console.log(this.MEETING_FRONT_URL);
		// if( this.isMeetingOpen ) {
		window.open(this.MEETING_FRONT_URL + "/room/" + data._id);
		// }
		// else if( !this.isMeetingOpen ){
		//     this.dialogService.openDialogNegative('The meeting has not been held yet... Ask the host to open meeting ')
		// }
		// console.log(data)
		// this.docService.joinMeeting(data);
	}

	deleteMeeting(data) {
		// const data = this.data;
		console.log(data);
		this.dialogService.openDialogConfirm("Do you want to cancel the meeting?").subscribe((result) => {
			if (result) {
				// meeting 삭제
				// meeting pdf 삭제
				this.docsService.deleteMeetingPdfFile(data).subscribe(
					(data: any) => {
						// console.log(data)
					},
					(err: any) => {
						console.log(err);
					}
				);

				// meeting안에 있는 채팅 삭제
				this.docsService.deleteAllOfChat(data).subscribe(
					(data: any) => {
						// console.log(data)
					},
					(err: any) => {
						console.log(err);
					}
				);

				// 미팅 삭제
				this.docsService.deleteMeeting(data).subscribe(
					(data: any) => {
						console.log(data);
						this.dialogService.openDialogPositive("Successfully, the meeting has been deleted.");
						//   this.dialogRef.close();
					},
					(err: any) => {
						console.log(err);
					}
				);
			}
		});
	}
}
