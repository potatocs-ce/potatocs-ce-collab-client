import { Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/@dw/services/common/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// 자신의 휴가 리스트 가져오기
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';
import { LeaveRequestDetailsComponent } from '../../../components/leave-request-details/leave-request-details.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/@dw/store/data.service';
import * as moment from 'moment';
import { MyRequestLeaveStorageService } from 'src/@dw/store/my-request-leave-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Interface
import { ViewType } from 'src/@dw/interfaces/viewType.interface';

// view table
export interface PeriodicElement {
	leaveStartDate: Date;
	duration: number;
	leaveType: string;
	approver: string;
	status: string
}

// const ELEMENT_DATA: PeriodicElement[] = [
// 	{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
// 	{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
// 	{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' }
// ];

@Component({
	selector: 'app-request-leave-list',
	templateUrl: './request-leave-list.component.html',
	styleUrls: ['./request-leave-list.component.scss']
})

export class RequestLeaveListComponent implements OnInit, OnDestroy {

	// FormGroup
	employeeForm: FormGroup;

	// 자신의 휴가 리스트 받는 변수
	myRequestList;

	// 이번 달 1일, 말일 만드는 변수
	// date = new Date();
	// monthFirst = new Date(this.date.setDate(1));
	// tmp = new Date(this.date.setMonth(this.date.getMonth() + 1));
	// monthLast = new Date(this.tmp.setDate(0));

	date = new Date();
	timezone = this.commonService.dateFormatting(this.date, 'timeZone');

	viewType:ViewType = {
		'annual_leave': 'Annual Leave',
		'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacement_leave': 'Replacement Day'
	}

	company;
	manager;
	isRollover = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	// select
	myFilter = (d: Date | null): boolean => {
		const day = (d || new Date()).getDay();
		// Prevent Saturday and Sunday from being selected.
		return day !== 0 && day !== 6;
	}

	// view table
	displayedColumns: string[] = ['createAt','leaveStartDate', 'duration', 'leaveType', 'approver', 'status'];
	// dataSource = ELEMENT_DATA;
	private unsubscribe$ = new Subject<void>();
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private commonService: CommonService,
		private leaveMngmtService: LeaveMngmtService,
		private myRequestLeaveStorage: MyRequestLeaveStorageService,
		public dialog: MatDialog,
		public dataService: DataService,
		private snackbar: MatSnackBar,
	) { }

	ngOnInit(): void {

    // console.log(this.date.setDate(1));
    // console.log(this.tmp.setDate(0));

		this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$))
		.subscribe(
			(data: any) => {
				this.company = data;
				console.log(this.company)
				if(this.company != null || this.company?.isRollover != false){
					this.isRollover = true;
				}
			},
			(err: any) => {
				console.log(err);
			}
		)

		this.dataService.userManagerProfile.pipe(takeUntil(this.unsubscribe$))
		.subscribe(
			(data: any) => {
				this.manager = data;
			},
			(err: any) => {
				console.log(err);
			}
		)

		this.myRequestLeaveStorage.myRequestLeaveData.pipe(takeUntil(this.unsubscribe$))
		.subscribe(
			(data: any) => {
				this.myRequestList = data;
				this.myRequestList = new MatTableDataSource<PeriodicElement>(data);
				this.myRequestList.paginator = this.paginator;
				console.log(this.myRequestList);
			}
		);



		const startOfMonth = moment().startOf('month').format();
		const endOfMonth   = moment().endOf('month').format();
		
		// console.log(moment());
		// console.log(moment().startOf('month'));
		// console.log(endOfMonth);
		// const startOfMonth = this.commonService.dateFormatting(this.date);
		// const endOfMonth   = this.commonService.dateFormatting(this.date);

		this.employeeForm = this.fb.group({
			type1: ['all', [
				Validators.required,
			]],
			type2: ['all', [
				Validators.required,
			]],
			leave_start_date: [startOfMonth, [
				Validators.required,
			]],
			leave_end_date: [endOfMonth, [
				Validators.required,
			]],
			status: ['all', [
				Validators.required,
			]],
		});
		console.log(this.employeeForm.value);
		this.leaveInfo();
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	
	}

	// 휴가 조회
	leaveInfo() {
		// console.log('leaveInfo 버튼')

		let employeeInfo;
		const formValue = this.employeeForm.value;

		employeeInfo = {
			type1: formValue.type1,
			type2: formValue.type2,
			leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
			leave_end_date: this.commonService.dateFormatting(formValue.leave_end_date),
			// leave_start_date: formValue.leave_start_date,
			// leave_end_date: formValue.leave_end_date,
			status: formValue.status,
		}

		console.log('[[[ form value check ]]]', employeeInfo);

		// 조건에 따른 자기 휴가 가져오기
		this.leaveMngmtService.getMyLeaveListSearch(employeeInfo).subscribe(
			(data: any) => {
                console.log(data)
				console.log('getMyLEaveListSearch');

				// data = data.map ((item)=> {
				// 	item.leave_start_date = this.commonService.dateFormatting(item.leave_start_date, 'timeZone');
				// 	item.leave_end_date = this.commonService.dateFormatting(item.leave_end_date, 'timeZone');
				// 	return item;
				// });


				// console.log(data);
				// this.myRequestList = new MatTableDataSource<PeriodicElement>(data);
				// this.myRequestList.paginator = this.paginator;
			}
		);
		return true;
	}

	// search 버튼 눌렀을때
	searchBtn(){
		const flag = this.leaveInfo();
		if(flag){
			this.snackbar.open('Successfully get leave search data','Close' ,{
				duration: 3000,
				horizontalPosition: "center"
			});
		}
	}

	requestLeave() {
		this.router.navigate(['leave/request-leave']);
	}

	openDialogPendingLeaveDetail(data) {
		
		if(data.status == 'pending'){
			const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {
				// width: '600px',
				// height: '614px',
	
				data: {
					_id: data._id,
					requestor: data.requestor,
					requestorName: data.requestorName,
					leaveType: data.leaveType,
					leaveDuration: data.leaveDuration,
					leave_end_date: data.leave_end_date,
					leave_start_date: data.leave_start_date,
					leave_reason: data.leave_reason,
					status: data.status,
					createdAt: data.createdAt,
					approver: data.approver,
					rejectReason: data.rejectReason,
					pending: true,
                    isManager: false
				}
			});
            
			dialogRef.afterClosed().subscribe(async(result) => {
				this.leaveInfo();
			})
		}
		else {
			const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {
				// width: '600px',
				// height: '614px',
	
				data: {
					_id: data._id,
					requestor: data.requestor,
					requestorName: data.requestorName,
					leaveType: data.leaveType,
					leaveDuration: data.leaveDuration,
					leave_end_date: data.leave_end_date,
					leave_start_date: data.leave_start_date,
					leave_reason: data.leave_reason,
					status: data.status,
					createdAt: data.createdAt,
					approver: data.approver,
					rejectReason: data.rejectReason,
                    isManager: false
				}
			});
			dialogRef.afterClosed().subscribe(result => {
			})
		}

		
	}
}
