import { Component, Inject, OnDestroy, OnInit, ViewChild, WritableSignal } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import moment from "moment";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs";
import { DialogService } from "../../../../stores/dialog/dialog.service";
import { CommonService } from "../../../../services/common/common.service";
import { LeavesService } from "../../../../services/leaves/leaves.service";
import { ProfilesService } from "../../../../services/profiles/profiles.service";
import { MaterialsModule } from "../../../../materials/materials.module";

@Component({
	selector: "app-replacements-leaves-requests-dialog",
	standalone: true,
	imports: [MaterialsModule],
	templateUrl: "./replacements-leaves-requests-dialog.component.html",
	styleUrl: "./replacements-leaves-requests-dialog.component.scss",
})
export class ReplacementsLeavesRequestsDialogComponent {
	// calculate diff
	days: any;
	start_date_sec: any;
	end_date_sec: any;
	millisecondsPerDay: any;
	diff: any;
	weeks: any;
	leaveDays: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	// view table
	displayedColumns: string[] = ["name", "from", "to", "type", "days", "manager", "status", "btns"];

	// replacement day requests
	getInputData;
	rdRequestData;
	rdFormData;

	leaveDuration;
	isHalf: boolean;

	company;
	manager;
	user;

	minDate;
	maxDate;
	// form group
	rdLeaveForm: FormGroup;
	holidayList = [
		// '2022-01-31', '2022-02-01', '2022-02-02', '2022-03-01', '2022-03-09',
		// '2022-05-05', '2022-06-01', '2022-06-06', '2022-08-15', '2022-09-09', '2022-09-12', '2022-10-03', '2022-10-10',
	];

	userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;
	userCompanyInfo: WritableSignal<any> = this.profilesService.userCompanyInfo;
	userManagerInfo: WritableSignal<any> = this.profilesService.userManagerInfo;

	holidayDateFilter = (d: Date): any => {
		if (d == null) {
			return;
		}
		const day = d.getDay();
		// check if date is weekend day
		if (day === 0 || day === 6) {
			return false;
		}

		// check if date is holiday
		let s = moment(d);
		if (this.holidayList) {
			return !this.holidayList.find((x) => {
				return moment(x).isSame(s, "day");
			});
		}
	};

	// dataSource = ELEMENT_DATA;
	private unsubscribe$ = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<ReplacementsLeavesRequestsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogService: DialogService,
		private commonService: CommonService,
		private leavesService: LeavesService,
		private profilesService: ProfilesService
	) {
		this.company = this.userCompanyInfo();
		this.manager = this.userManagerInfo();
		this.user = this.userProfileInfo();
	}

	ngOnInit(): void {
		if (this.user.location == null || this.user.location == "") {
			this.leavesService.getNationHolidays(this.user.locacation).subscribe({
				next: (data: any) => {
					const nationHoliday = data.nation[0];
					// console.log(nationHoliday);
					if (data.nation == null || data.nation == "") {
					} else {
						for (let index = 0; index < nationHoliday.countryHoliday.length; index++) {
							const element = nationHoliday.countryHoliday[index].holidayDate;
							this.holidayList.push(element);
						}
						console.log(this.holidayList);
					}
				},
				error: (err: any) => {
					console.log(err);
				},
			});
		}
		if (this.company._id == null || this.company._id == "") {
			return;
		} else {
			////
			// company holiday 를 holidayList에 넣기
			for (let index = 0; index < this.company.company_holiday.length; index++) {
				const element = this.company.company_holiday[index].ch_date;
				this.holidayList.push(element);
			}
			// console.log(this.holidayList);
			////
		}

		const today = moment(new Date());
		const empStartDate = moment(this.user.emp_start_date);
		const careerYear = today.diff(empStartDate, "years");

		this.minDate = moment(this.data.leave_end_date).format("YYYY-MM-DD");
		this.maxDate = moment(this.minDate)
			.add(this.company.rd_validity_term, "M")
			.subtract(1, "days")
			.format("YYYY-MM-DD");
		// console.log(this.minDate);
		// console.log(this.maxDate);

		this.getInputData = "";
		this.getInputData = this.data;
		// console.log(this.getInputData);

		this.rdLeaveForm = this.fb.group({
			leaveType1: ["replacement_leave", [Validators.required]],
			leaveType2: ["", [Validators.required]],
			from: ["", [Validators.required]],
			to: ["", [Validators.required]],
			leave_reason: ["", [Validators.required]],
		});

		this.datePickDisabled();
	}
	requestLeaveRd() {
		const formValue = this.rdLeaveForm.value;

		if (this.leaveDuration == 0.5) {
			this.rdRequestData = {
				_id: this.data._id,
				leaveType: formValue.leaveType1,
				leaveDay: formValue.leaveType2,
				leaveDuration: this.leaveDuration,
				leave_start_date: this.commonService.dateFormatting(formValue.from),
				leave_end_date: this.commonService.dateFormatting(formValue.from),
				leave_reason: formValue.leave_reason,
				status: "pending",
			};
		} else {
			this.rdRequestData = {
				_id: this.data._id,
				leaveType: formValue.leaveType1,
				leaveDay: formValue.leaveType2,
				leaveDuration: this.leaveDuration,
				leave_start_date: this.commonService.dateFormatting(formValue.from),
				leave_end_date: this.commonService.dateFormatting(formValue.to),
				leave_reason: formValue.leave_reason,
				status: "pending",
			};
		}

		this.leavesService.requestRdLeave(this.rdRequestData).subscribe(
			(data: any) => {
				if (data.message == "hihi") {
					this.dialogService.openDialogPositive("Successfully, the request has been submitted.");
					this.dialogRef.close();
				}
			},
			(err) => {
				console.log(err);
			}
		);
	}

	classificationChange(value) {
		this.rdLeaveForm.get("leaveType2").setValue("");
		this.datePickDisabled();
		this.datePickReset();
	}

	typeSecondChange(value) {
		if (value == "half") {
			this.rdLeaveForm.controls["from"].enable();
			this.rdLeaveForm.controls["to"].disable();

			this.datePickReset();
			this.isHalf = true;
		} else {
			this.rdLeaveForm.controls["from"].enable();
			this.rdLeaveForm.controls["to"].enable();

			this.datePickReset();
			this.isHalf = false;
		}
	}
	checkDateChange(value) {
		const formValue = this.rdLeaveForm.value;
		const start_date = formValue.from;
		const end_date = formValue.to;
		const matchedLeaveDay = this.getInputData.leaveDuration - this.getInputData.taken;
		// console.log(matchedLeaveDay);

		if (this.isHalf) {
			this.leaveDuration = 0.5;
			this.rdLeaveForm.get("to").setValue("");

			if (this.leaveDuration > matchedLeaveDay) {
				this.dialogService.openDialogNegative("Wrong period, Try again.");
				// alert('Wrong period, Try again.');
				this.allReset();
				return;
			}
		} else {
			this.leaveDuration = this.calculateDiff(start_date, end_date);
			// console.log(this.leaveDuration);
			if (this.leaveDuration > matchedLeaveDay) {
				this.dialogService.openDialogNegative("Wrong period, Try again.");
				// alert('Wrong period, Try again.');
				this.allReset();
				return;
			}
		}
	}
	datePickChange(dateValue) {
		this.rdLeaveForm.get("to").setValue("");
	}
	calculateDiff(start_date, end_date) {
		const holidayCount = this.holidayList.filter((x: any): any => {
			if (new Date(x) <= end_date && new Date(x) >= start_date) {
				return true;
			}
		}).length;

		this.millisecondsPerDay = 86400 * 1000; // Day in milliseconds
		this.start_date_sec = start_date.setHours(0, 0, 0, 1); // Start just after midnight
		this.end_date_sec = end_date.setHours(23, 59, 59, 999); // End just before midnight
		this.diff = this.end_date_sec - this.start_date_sec; // Milliseconds between datetime objects
		this.days = Math.ceil(this.diff / this.millisecondsPerDay);

		if (this.start_date_sec >= this.end_date_sec) {
			this.dialogService.openDialogNegative("Wrong period, Try again.");
			this.datePickReset();
		}

		// Subtract two weekend days for every week in between
		this.weeks = Math.floor(this.days / 7);
		this.days = this.days - this.weeks * 2;

		// Handle special cases
		this.start_date_sec = start_date.getDay();
		this.end_date_sec = end_date.getDay();

		// Remove weekend not previously removed.
		// if (this.start_date_sec - this.end_date_sec > 1)
		// 	this.days = this.days - 2;

		// Remove start day if span starts on Sunday but ends before Saturday
		// if (this.start_date_sec == 0 && this.end_date_sec != 6)
		// 	this.days = this.days - 1;

		// Remove end day if span ends on Saturday but starts after Sunday
		// if (this.end_date_sec == 6 && this.start_date_sec != 0) {
		// 	this.days = this.days - 1;
		// }

		this.leaveDays = this.days;

		if (this.leaveDays == "NaN" || this.leaveDays == "" || this.leaveDays <= "0" || this.leaveDays == "undefined") {
			this.leaveDays = "";
		} else {
			this.leaveDays = this.days;
		}

		// console.log(this.leaveDays);
		return this.leaveDays;
	}

	datePickReset() {
		this.rdLeaveForm.get("from").setValue("");
		this.rdLeaveForm.get("to").setValue("");
	}

	datePickDisabled() {
		this.rdLeaveForm.controls["from"].disable();
		this.rdLeaveForm.controls["to"].disable();
	}

	allReset() {
		this.rdLeaveForm.get("leaveType1").setValue("");
		this.rdLeaveForm.get("leaveType2").setValue("");
		this.datePickReset();
		this.datePickDisabled();
	}
}
