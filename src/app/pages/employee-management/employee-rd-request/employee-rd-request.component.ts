import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
// table page
import { MatPaginator } from '@angular/material/paginator';
import { RdRequestDetailsComponent } from '../../../components/rd-request-details/rd-request-details.component';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { Subject } from 'rxjs';
import { ApprovalMngmtService } from 'src/@dw/services/leave/approval-mngmt/approval-mngmt.service';
import { CommonService } from 'src/@dw/services/common/common.service';

// Interface
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
	selector: 'app-employee-rd-request',
	templateUrl: './employee-rd-request.component.html',
	styleUrls: ['./employee-rd-request.component.scss']
})
export class EmployeeRdRequestComponent implements OnInit {
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
		this.getRdRequest();
	}
	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();

	}

	getRdRequest(){
		this.approvalMngmtService.getConfirmRdRequest().subscribe(
			(data: any) => {
				// console.log(data);
				if(data.message == 'getConfirmRdRequest') {
					data = data.rdConfirmRequests.map ((item)=> {
						item.leave_start_date = this.commonService.dateFormatting(item.leave_start_date, 'timeZone');
						item.leave_end_date = this.commonService.dateFormatting(item.leave_end_date, 'timeZone');
						return item;
					});
				}
				this.dataSource = data.rdConfirmRequest;
				// console.log(this.dataSource);

			},
			(err: any) => {
				console.log(err);
			}
		)
	}

	// RD요청 승인 DB에 추가
	approveReplacement(data) {
		this.dialogService.openDialogConfirm('Do you approve this replacement request?').subscribe(result => {
			if (result) {
				// console.log(data);
				this.approvalMngmtService.approveReplacementRequest(data).subscribe(
					(data: any) => {
						if (data.message == 'approve') {
							// console.log(data);
							this.getRdRequest();
						}
						this.dialogService.openDialogPositive('Successfully, the request has been approved.');
					}
				);
				this.approvalMngmtService.getLeaveRequest().subscribe(
					(data: any) => { }
				)
			}
		})
	}
	
	// RD 요청 rejected 
	rejectReplacement(data) {
		console.log('rejectLeave');
		data.reject = true;
		this.openDialogRdRequestDetail(data);
	}

	openDialogRdRequestDetail(data) {

		const dialogRef = this.dialog.open(RdRequestDetailsComponent, {

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
				reject: data.reject
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('dialog close');
			data.reject = false;
			this.getRdRequest();
		});
	}

}