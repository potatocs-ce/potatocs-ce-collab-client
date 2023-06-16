import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveRequestDetailsComponent } from '../../../components/leave-request-details/leave-request-details.component';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { ApprovalMngmtService } from 'src/@dw/services/leave/approval-mngmt/approval-mngmt.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from 'src/@dw/services/common/common.service';
import { ViewType } from 'src/@dw/interfaces/viewType.interface';

// view table
export interface PeriodicElement {
	Period: Date;
	// to: Date;
	Day: number;
	Type: string;
	Name: string;
	status: string;
}

@Component({
	selector: 'app-pending-leave',
	templateUrl: './pending-leave.component.html',
	styleUrls: ['./pending-leave.component.scss']
})
export class PendingLeaveComponent implements OnInit {
	displayedColumns: string[] = ['period', 'leaveDuration', 'leaveType', 'requestorName', 'status', 'btns'];
	dataSource;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	viewType:ViewType = {
		'annual_leave': 'Annual Leave',
		'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacement_leave': 'Replacement Day'
	}
	private unsubscribe$ = new Subject<void>();

	constructor(
		private approvalMngmtService: ApprovalMngmtService,
		private commonService: CommonService,
		public dialog: MatDialog,
		public dialogService: DialogService,
	) { }

	ngOnInit(): void {
		
        this.getLeaveRequest();
	}
	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();

	}

    getLeaveRequest() {
        this.approvalMngmtService.getLeaveRequest().subscribe(
			(data: any) => {
				// console.log(data);
                if(data.message =='getPendingData') {
                    data.pendingLeaveReqList = data.pendingLeaveReqList.map ((item)=> {
                        item.leave_start_date = this.commonService.dateFormatting(item.leave_start_date, 'timeZone');
                        item.leave_end_date = this.commonService.dateFormatting(item.leave_end_date, 'timeZone');
                        return item;
                    });
                }

                this.dataSource = new MatTableDataSource<PeriodicElement>(data.pendingLeaveReqList);
				this.dataSource.paginator = this.paginator;
			},
			(err: any) => {
				console.log(err);
			}
		)
    };

	// 휴가요청 승인 DB에 추가
	approveLeave(data) {
		this.dialogService.openDialogConfirm('Do you approve this leave request?').subscribe(result => {
			if (result) {
				// console.log(data);
				this.approvalMngmtService.approvedLeaveRequest(data).subscribe(
					(data: any) => {
						// console.log('[[ approved leave request >>>', data);
						if (data.message == 'approve') {
							this.getLeaveRequest();
						}
						this.dialogService.openDialogPositive('Successfully, the request has been approved');
					}
				);
			}
		})
	}

	// 휴가 요청 rejected 
	rejectLeave(data) {
		data.reject = true;
		this.openDialogPendingLeaveDetail(data);
	}

	openDialogPendingLeaveDetail(data) {

		const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {

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
				reject: data.reject,
				rdRequest: data.rdRequest
			}
		});

		dialogRef.afterClosed().subscribe(result => {
            data.reject = false;
			this.getLeaveRequest();
		});
	}

}