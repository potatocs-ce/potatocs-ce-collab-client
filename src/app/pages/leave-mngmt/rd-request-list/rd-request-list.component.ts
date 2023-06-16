import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';
import { DataService } from 'src/@dw/store/data.service';
import { RdRequestDetailsComponent } from 'src/app/components/rd-request-details/rd-request-details.component';
import { ReplacementDayRequestComponent } from '../replacement-day-request/replacement-day-request.component';
import { ReplacementLeaveRequestComponent } from '../replacement-leave-request/replacement-leave-request.component';

@Component({
    selector: 'app-rd-request-list',
    templateUrl: './rd-request-list.component.html',
    styleUrls: ['./rd-request-list.component.scss'],
})
export class RdRequestListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    // view table
    displayedColumns: string[] = ['from', 'to', 'type','taken', 'days', 'manager', 'status', 'btns'];

    // replacement day requests
    rdRequestList;

    company;
    manager;
    userInfo;

    // dataSource = ELEMENT_DATA;
    private unsubscribe$ = new Subject<void>();

    constructor(
		public dataService: DataService,
		public dialog: MatDialog,
        private leaveMngmtService: LeaveMngmtService,
        private dialogService: DialogService
	) {}

    ngOnInit(): void {
        this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.company = data;
                // if(this.company.rollover_max_day != undefined){
                // 	this.isRollover = true;
                // }
            },
            (err: any) => {
                console.log(err);
            },
        );

        this.dataService.userManagerProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.manager = data;
            },
            (err: any) => {
                console.log(err);
            },
        );
		
		this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
                this.userInfo = data;
			},
			(err: any) => {
				console.log(err);
			}
		)

        this.getRdList();

    }

    // RD 요청
    openRdRequest() {
        const dialogRef = this.dialog.open(ReplacementDayRequestComponent, {

			data: this.userInfo
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getRdList();
		})
    }

    // RD 휴가 요청
    openRdLeaveRequest(element){
        const dialogRef = this.dialog.open(ReplacementLeaveRequestComponent, {

			data: element
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getRdList();
		})
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    getRdList() {
        this.leaveMngmtService.getRdList().subscribe(
            (data: any) => {
                this.rdRequestList = data.rdList;
                // console.log(this.rdRequestList);
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    cancelRd(rdRequestId) {
        const rdObjId = {
            _id: rdRequestId
        }

        this.dialogService.openDialogConfirm('Do you want to cancel this request?').subscribe( (result: any) => {
            if(result) {
                this.leaveMngmtService.requestCancelRd(rdObjId).subscribe( 
                    (data: any) => {
                        // console.log(data);
                        if(data.message == 'requestCancelRd') {
                            this.getRdList();
                        }
                    },
                    (err: any) => {
                        console.log(err);
						this.dialogService.openDialogNegative(err.error.message);
                    }
                );
            }
        });
    }

    openDialogRdRequestDetails(data) {
        const dialogRef = this.dialog.open(RdRequestDetailsComponent, {
 
            data: {
                _id: data._id,
                requestorName: data.requestor,
                leaveType: data.leaveType,
                leaveDuration: data.leaveDuration,
                leave_end_date: data.leave_end_date,
                leave_start_date: data.leave_start_date,
                leave_reason: data.leave_reason,
                status: data.status,
                createdAt: data.createdAt,
                approver: data.approver,
                rejectReason: data.rejectReason,
            }

        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close');
        });
    }
}
