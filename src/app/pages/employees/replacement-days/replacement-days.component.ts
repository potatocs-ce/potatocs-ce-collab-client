import { RdRequestsDetailsDialogComponent } from './../../../components/dialogs/rd-requests-details-dialog/rd-requests-details-dialog.component';
import { DialogService } from './../../../stores/dialog/dialog.service';
import { ApprovalService } from './../../../services/approval/approval.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonService } from '../../../services/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-replacement-days',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './replacement-days.component.html',
  styleUrl: './replacement-days.component.scss',
})
export class ReplacementDaysComponent {
  approvalService = inject(ApprovalService);
  commonService = inject(CommonService);
  dialogService = inject(DialogService);
  dialog = inject(MatDialog);

  viewType: any = {
    annual_leave: 'Annual Leave',
    rollover: 'Rollover',
    sick_leave: 'Sick Leave',
    replacement_leave: 'Replacement Day',
  };

  displayedColumns: string[] = [
    'period',
    'leaveDuration',
    'leaveType',
    'requestorName',
    'status',
    'btns',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = signal<number>(10);
  resultsLength = signal<number>(0);
  isLoadingResults = signal<boolean>(true);
  isRateLimitReached = signal<boolean>(false);
  dataSource = signal<any[]>([]);

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => this.getRdRequest()),
        map((res: any) => {
          this.isLoadingResults.set(false);
          if (res === null) {
            this.isRateLimitReached.set(true);
            return [];
          }
          this.isRateLimitReached.set(false);
          this.resultsLength.set(res.totalCount);
          return res;
        }),
        catchError(() => {
          this.isLoadingResults.set(false);
          this.isRateLimitReached.set(true);
          return of([]);
        })
      )
      .subscribe((data: any) => {
        if (data) {
          this.dataSource.set(data.rdConfirmRequest);
        }
      });
  }
  getRdRequest() {
    this.isLoadingResults.set(true);
    return this.approvalService.getConfirmRdRequest(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  // RD요청 승인 DB에 추가
  approveReplacement(data: any) {
    this.dialogService
      .openDialogConfirm('Do you approve this replacement request?')
      .subscribe((result) => {
        if (result) {
          // console.log(data);
          this.approvalService
            .approveReplacementRequest(data)
            .subscribe((data: any) => {
              if (data.message == 'approve') {
                // console.log(data);
                this.getRdRequest();
              }
              this.dialogService.openDialogPositive(
                'Successfully, the request has been approved.'
              );
            });
          // this.approvalService.getLeaveRequest().subscribe(
          //   (data: any) => { }
          // )
        }
      });
  }

  // RD 요청 rejected
  rejectReplacement(data: any) {
    console.log('rejectLeave');
    data.reject = true;
    this.openDialogRdRequestDetail(data);
  }

  openDialogRdRequestDetail(data: any) {
    const dialogRef = this.dialog.open(RdRequestsDetailsDialogComponent, {
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
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog close');
      data.reject = false;
      this.getRdRequest();
    });
  }
}
