import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';

// table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveRequestDetailsComponent } from '../../../components/leave-request-details/leave-request-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/@dw/store/data.service';

// Interface
import { ViewType } from 'src/@dw/interfaces/viewType.interface';

// view table
export interface PeriodicElement {
	createAt: Date;
	leave_start_date: Date;
	leave_end_date: Date;
	leaveDuration: number;
	leaveType: string;
	approver: string;
	status: string;
	leave_reason: string;
	requestorName: string;
}

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

	currentDate;

	// view table
	displayedColumns: string[] = ['createAt', 'leaveStartDate', 'duration', 'leaveType', 'approver', 'status'];

	// 휴가 변수들
	leaveInfo;
	company;

	// 3개월 전부터 지금까지 신청한 휴가 변수
	threeMonthBeforeLeaveList;

	isRollover = false
	viewType:ViewType = {
		'annual_leave': 'Annual Leave',
		'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacement_leave': 'Replacement Day'
	}
	@ViewChild(MatPaginator) paginator: MatPaginator;
	private unsubscribe$ = new Subject<void>();
	

	constructor(
		private leaveMngmtService: LeaveMngmtService,
		public dialog: MatDialog,
		private dataService: DataService
	) { }

	
	ngOnInit(): void {

		// 휴가 타입마다 사용일, 남은휴가, 총휴가

		this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.company = data
				// console.log(data);
				if(this.company.rollover_max_day != undefined){
					this.isRollover = true;
				}

				// 휴가 status 회사 이월 때문에 여기로
				this.leaveMngmtService.getMyLeaveStatus().subscribe(
					(data: any) => {
						// console.log('get userLeaveStatus');
						console.log(data);
						this.leaveInfo = data;
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

		// this.leaveMngmtService.getMyLeaveStatus().subscribe(
		// 	(data: any) => {

		// 		// console.log('get userLeaveStatus');
		// 		console.log(data);
		// 		this.leaveInfo = data;
		// 	}
		// );

		// 나의 휴가 리스트 가져오기
		this.leaveMngmtService.getMyLeaveList().subscribe(
			(data: any) => {
				// console.log('getMyLeaveList')
				// console.log(...data.leaveRequestList);
				this.threeMonthBeforeLeaveList = new MatTableDataSource<PeriodicElement>(data.leaveRequestList);
				this.threeMonthBeforeLeaveList.paginator = this.paginator;
			}
		);
		this.currentDate = new Date();
		// console.log(this.currentDate);
	}

	openDialogPendingLeaveDetail(data) {

		const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {
			// width: '600px',
			// height: '614px',

			data: {
				requestor: data.requestor,
				requestorName: data.requestorName,
				leaveType: data.leaveType,
				leaveDuration: data.leaveDuration,
				leave_end_date: data.leave_end_date,
				leave_start_date: data.leave_start_date,
				leave_reason: data.leave_reason,
				status: data.status,
				createdAt: data.createdAt,
				approver: data.approver
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('dialog close');
		})
	}
}
