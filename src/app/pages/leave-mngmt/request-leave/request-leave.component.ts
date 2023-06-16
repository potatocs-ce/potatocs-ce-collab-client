import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from 'src/@dw/services/common/common.service';
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';
import { DataService } from 'src/@dw/store/data.service';

import * as moment from 'moment';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-request-leave',
	templateUrl: './request-leave.component.html',
	styleUrls: ['./request-leave.component.scss']
})
export class RequestLeaveComponent implements OnInit {
	//
	days: any;
	start_date_sec: any;
	end_date_sec: any;
	millisecondsPerDay: any;
	diff: any;
	weeks: any;
	leaveDays: any;

	rolloverMinDate;
	rolloverMaxDate;
	minDate = '' // rollover 제한
	maxDate = '' // rollover 제한
	isRollover = false // rollover 제한
	myInfo;
	employeeLeaveForm: FormGroup;
	// 원하는 총 휴가 기간
	leaveDuration;
	isHalf: boolean;
	leaveRequestData;
	leaveInfo;
	company;
	user;
	// 달력 주말 필터
	holidayList = [
		// '2022-01-31', '2022-02-01', '2022-02-02', '2022-03-01', '2022-03-09',
		// '2022-05-05', '2022-06-01', '2022-06-06', '2022-08-15', '2022-09-09', '2022-09-12', '2022-10-03', '2022-10-10',
	];
	holidayDateFilter = (d: Date): boolean => {
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
			return !this.holidayList.find(x => {
				return moment(x).isSame(s, 'day');
			});
		}
	};

	RolloverDateFilter() {
		console.log('11111111111');
	}
	private unsubscribe$ = new Subject<void>();


	constructor(
		private fb: FormBuilder,
		private dataService: DataService,
		private commonService: CommonService,
		private leaveMngmtService: LeaveMngmtService,
		private router: Router,
		private dialogService: DialogService
	) { }

	ngOnInit(): void {

		this.minDate = '';


		this.employeeLeaveForm = this.fb.group({
			leaveType1: ['', [Validators.required]],
			leaveType2: ['', [Validators.required]],
			leave_start_date: ['', [Validators.required]],
			leave_end_date: ['', [Validators.required]],
			leave_reason: ['', [Validators.required]],
		});

		this.datePickDisabled();

		this.dataService.userProfile.subscribe(
			(res: any) => {
				// console.log('request-leave dataService data >>>', res);
				this.myInfo = res;
			}
		);

		// this.leaveMngmtService.getMyLeaveStatus().subscribe(
		// 	(data: any) => {
		// 		console.log(data);
		// 		this.leaveInfo = data;
		// 	}
		// );
		this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.user = data;
				if (data._id == null || data._id == '') {
					return
				}
				else {
					if (data.location == null || data.location == '') {
					}
					else {
						const nationId = {
							_id: data.location
						}

						this.leaveMngmtService.getNationList(nationId).subscribe(
							(data: any) => {

								const nationHoliday = data.nation[0];
								// console.log(nationHoliday);
								if (data.nation == null || data.nation == '') {
								}
								else {
									for (let index = 0; index < nationHoliday.countryHoliday.length; index++) {
										const element = nationHoliday.countryHoliday[index].holidayDate;
										this.holidayList.push(element);
									}
									console.log(this.holidayList);
								}
							},
							(err: any) => {
								console.log(err)
							}
						)
					}
				}
			})

		this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.company = data;
				if (data._id == null || data._id == '') {
					return
				}
				else {
					////
					// company holiday 를 holidayList에 넣기
					for (let index = 0; index < data.company_holiday.length; index++) {
						const element = data.company_holiday[index].ch_date;
						this.holidayList.push(element);
					}
					// console.log(this.holidayList);
					////
				}

				// 휴가 status 회사 이월 때문에 여기로
				this.leaveMngmtService.getMyLeaveStatus().subscribe(
					(data: any) => {
						// console.log('get userLeaveStatus');
						// console.log(data);
						this.leaveInfo = data;
						if (this.leaveInfo.rollover != undefined && this.company.rollover_max_day != undefined) {
							this.isRollover = true;
							this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
								(data: any) => {

									// n년차 계산
									const today = moment(new Date());
									const empStartDate = moment(data.emp_start_date);
									const careerYear = (today.diff(empStartDate, 'years'));
									// console.log(careerYear);

									// 계약 시작일에 n년 더해주고, max에는 회사 rollover 규정 더해줌
									this.rolloverMinDate = moment(data.emp_start_date).add(careerYear, 'y').format('YYYY-MM-DD');
									this.rolloverMaxDate = moment(this.rolloverMinDate).add(this.company.rollover_max_month, "M").subtract(1, 'days').format('YYYY-MM-DD');

									// console.log(this.minDate);
									// console.log(this.maxDate);
								}
							)
						}
						// console.log(this.leaveInfo.rollover);
						// console.log(this.company.rollover_max_day);
						this.leaveInfo.rollover = Math.min(this.leaveInfo.rollover, this.company.rollover_max_day);
					}
				);
			},
			(err: any) => {
				console.log(err);
			}
		);
	}
	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	toBack(): void {
		this.router.navigate(['leave/leave-request-list']);
	}

	requestLeave() {
		// const result = confirm('Would you like to request a vacation?');

		// if(result){
		this.dialogService.openDialogConfirm('Would you like to submit the leave request?').subscribe(result => {
			if (result) {
				const formValue = this.employeeLeaveForm.value;
				if (this.leaveDuration == 0.5) {
					this.leaveRequestData = {
						leaveType: formValue.leaveType1,
						leaveDay: formValue.leaveType2,
						leaveDuration: this.leaveDuration,
						leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
						leave_end_date: this.commonService.dateFormatting(formValue.leave_start_date),
						leave_reason: formValue.leave_reason,
						status: 'pending'
					}

				} else {
					this.leaveRequestData = {
						leaveType: formValue.leaveType1,
						leaveDay: formValue.leaveType2,
						leaveDuration: this.leaveDuration,
						leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
						leave_end_date: this.commonService.dateFormatting(formValue.leave_end_date),
						leave_reason: formValue.leave_reason,
						status: 'pending'
					}

				}

				// console.log(this.leaveRequestData);


				this.leaveMngmtService.requestLeave(this.leaveRequestData).subscribe(
					(data: any) => {
						if (data.message == 'requested') {
							this.router.navigate(['leave/leave-request-list']);
							this.dialogService.openDialogPositive('Successfully, the request has been submitted.');
						}
					},
					err => {
						console.log(err.error);
						// this.dialogService.openDialogNegative('An error has occurred while requesting');
						// alert('An error has occurred while requesting');
						this.errorAlert(err.error.message);
					}
				);
			}
		});
	}

	errorAlert(err) {
		switch (err) {
			case 'Duplicate requestLeave':
				this.dialogService.openDialogNegative('Duplicate requestLeave.');
				break;
			case 'DB Error':
				this.dialogService.openDialogNegative('An error has occurred while requesting');
				break;
		}

	};


	isFieldInvalid(field: string) {
		return !this.employeeLeaveForm.get(field).valid;
	}

	classificationChange(value) {
		this.minDate = '';
		this.maxDate = '';

		if (value == 'rollover') {
			this.minDate = this.rolloverMinDate
			this.maxDate = this.rolloverMaxDate
		}
		this.employeeLeaveForm.get('leaveType2').setValue('');
		this.datePickDisabled();
		this.datePickReset();
	}

	// 연차, 반차 변화시 기간 설정 달력 disable/enable
	typeSecondChange(value) {

		if (value == 'half') {
			this.employeeLeaveForm.controls['leave_start_date'].enable();
			this.employeeLeaveForm.controls['leave_end_date'].disable();

			this.datePickReset();
			this.isHalf = true;
		} else {
			this.employeeLeaveForm.controls['leave_start_date'].enable();
			this.employeeLeaveForm.controls['leave_end_date'].enable();

			this.datePickReset();
			this.isHalf = false;
		}

	}

	// 날짜 입력 시 소모되는 일 체크
	checkDateChange(value) {
		// console.log(value);

		const formValue = this.employeeLeaveForm.value;
		const start_date = formValue.leave_start_date;
		const end_date = formValue.leave_end_date;
		const currentClassification = formValue.leaveType1;
		const matchedLeaveDay = this.availableLeaveCount(currentClassification);

		if (this.checkEmpYear(start_date, end_date)) {
			if (this.isHalf) {
				this.leaveDuration = 0.5;
				this.employeeLeaveForm.get('leave_end_date').setValue('');

				if (this.leaveDuration > matchedLeaveDay || this.leaveDuration < 0) {
					this.dialogService.openDialogNegative('Wrong period, Try again.');
					// alert('Wrong period, Try again.');
					this.allReset();
					return;
				}

			} else {
				this.leaveDuration = this.calculateDiff(start_date, end_date);

				if (this.leaveDuration > matchedLeaveDay || this.leaveDuration < 0) {
					this.dialogService.openDialogNegative('Wrong period, Try again.');
					// alert('Wrong period, Try again.');
					this.allReset();
					return;
				}
			}

			console.log(this.leaveDuration);
		}

	}

	datePickChange(dateValue) {
		// this.checkEmpYear(dateValue);
		this.employeeLeaveForm.get('leave_end_date').setValue('');
	}

	calculateDiff(start_date, end_date) {
		const holidayCount = this.holidayList.filter(x => {
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
			this.dialogService.openDialogNegative('Wrong period, Try again.');
			this.datePickReset();
		}

		// Subtract two weekend days for every week in between
		this.weeks = Math.floor(this.days / 7);
		this.days = this.days - (this.weeks * 2);

		// Handle special cases
		this.start_date_sec = start_date.getDay();
		this.end_date_sec = end_date.getDay();

		// Remove weekend not previously removed. 
		if (this.start_date_sec - this.end_date_sec > 1)
			this.days = this.days - 2;

		// Remove start day if span starts on Sunday but ends before Saturday
		if (this.start_date_sec == 0 && this.end_date_sec != 6)
			this.days = this.days - 1;

		// Remove end day if span ends on Saturday but starts after Sunday
		if (this.end_date_sec == 6 && this.start_date_sec != 0) {
			this.days = this.days - 1;
		}

		this.leaveDays = this.days;

		if (this.leaveDays == 'NaN' || this.leaveDays == '' || this.leaveDays <= '0' || this.leaveDays == 'undefined') {
			this.leaveDays = '';
		} else {
			this.leaveDays = this.days;
		}
		return this.leaveDays - holidayCount;
	}

	availableLeaveCount(stringValue) {

		if (stringValue == 'annual_leave') {
			return (this.leaveInfo['annual_leave'] - this.leaveInfo['used_annual_leave'])
		} else if (stringValue == 'rollover') {
			return (this.leaveInfo['rollover'] - this.leaveInfo['used_rollover'])
		} else if (stringValue == 'sick_leave') {
			return (this.leaveInfo['sick_leave'] - this.leaveInfo['used_sick_leave'])
		} else {
			return (this.leaveInfo['replacement_leave'] - this.leaveInfo['used_replacement_leave'])
		}
	}

	datePickReset() {
		this.employeeLeaveForm.get('leave_start_date').setValue('');
		this.employeeLeaveForm.get('leave_end_date').setValue('');
	}

	datePickDisabled() {
		this.employeeLeaveForm.controls['leave_start_date'].disable();
		this.employeeLeaveForm.controls['leave_end_date'].disable();
	}

	allReset() {
		this.employeeLeaveForm.get('leaveType1').setValue('');
		this.employeeLeaveForm.get('leaveType2').setValue('');
		this.datePickReset();
		this.datePickDisabled();
	}


	// 휴가 쓰는 기간이 N년차 범위에 속하는지, 안속하면 안돼
	checkEmpYear(start_date, end_date) {

		const cal_start_date = this.commonService.dateFormatting(start_date, 'timeZone');
		const cal_end_date = this.commonService.dateFormatting(end_date, 'timeZone');

		const startYear = this.commonService.dateFormatting(this.leaveInfo.startYear, 'timeZone');
		const endYear = this.commonService.dateFormatting(this.leaveInfo.endYear, 'timeZone');

		// 반차일떄
		if( this.isHalf ){
			return true;
		}

		// 휴가 시작. 종료일이 같은 년차에 들어가는지
		if (cal_start_date > startYear && cal_start_date < endYear && cal_end_date > startYear && cal_end_date < endYear) {
			return true;
		}

		// 휴가 시작 종료일이 다음해의 같은 년차에 들어가는지
		else if (cal_start_date > endYear && cal_end_date > endYear) {
			
			const flag = this.dialogService.openDialogConfirm(`Your current contract period: ${startYear} ~ ${endYear}.\nThis annual leave request will be counted on next year's annual leave. Do you want to proceed?`).subscribe(
				(result: any) => {
					if(result){
						return true;
					}
					else{
						this.datePickReset();
						return false;
					}
				}
			)
			return true;
		}
		else {
			this.dialogService.openDialogNegative(`Your current contract period: ${startYear} ~ ${endYear}.\nPlease, choose leave dates within the current contract period or after the end of your current period in order to use next year's annual leave.`);
			// alert('Please, choose a leave date within the contract period.');
			this.datePickReset();
			return false;
		}

	}
}
