import { MatDialog } from '@angular/material/dialog';
import { ApprovalService } from './../../../services/approval/approval.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '../../../services/common/common.service';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { DialogService } from '../../../stores/dialog/dialog.service';

import { LeaveRequestDetailDialogComponent } from '../../../components/dialogs/leave-request-detail-dialog/leave-request-detail-dialog.component';

@Component({
  selector: 'app-leaves-requests',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leaves-requests.component.html',
  styleUrl: './leaves-requests.component.scss',
})
export class LeavesRequestsComponent {
  displayedColumns: string[] = [
    'period',
    'leaveDuration',
    'leaveType',
    'requestorName',
    'status',
    'btns',
  ];

  approvalService = inject(ApprovalService);
  commonService = inject(CommonService);
  dialogsService = inject(DialogService);
  dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = signal<number>(10);
  resultsLength = signal<number>(0);
  isLoadingResults = signal<boolean>(true);
  isRateLimitReached = signal<boolean>(false);

  viewType: any = {
    annual_leave: 'Annual Leave',
    rollover: 'Rollover',
    sick_leave: 'Sick Leave',
    replacement_leave: 'Replacement Day',
  };

  leavesRequestList = signal<MatTableDataSource<any>>(new MatTableDataSource());

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.fetchLeaves().pipe(catchError(() => of([])));
        }),
        map((data) => {
          this.isLoadingResults.set(false);
          if (!data) {
            this.isRateLimitReached.set(true);
            return [];
          }
          this.isRateLimitReached.set(false);
          this.resultsLength.set(data.length);
          return data;
        })
      )
      .subscribe((data) =>
        this.leavesRequestList.set(new MatTableDataSource(data))
      );
  }

  fetchLeaves() {
    return this.approvalService
      .getLeaveRequest(
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize
      )
      .pipe(
        map((res: any) =>
          res.pendingLeaveReqList.map((item: any) => ({
            ...item,
            leave_start_date: this.commonService.dateFormatting(
              item.leave_start_date,
              'timeZone'
            ),
            leave_end_date: this.commonService.dateFormatting(
              item.leave_end_date,
              'timeZone'
            ),
          }))
        )
      );
  }

  refreshTable() {
    console.log('리프레쉬');
    this.fetchLeaves().subscribe((data) => {
      this.leavesRequestList.set(new MatTableDataSource(data));
      this.resultsLength.set(data.length);
    });
  }

  approveLeave(data: any, event: MouseEvent) {
    event.stopPropagation();
    this.dialogsService
      .openDialogConfirm('Do you approve this leave request?')
      .subscribe((result) => {
        if (result) {
          this.approvalService.approvedLeaveRequest(data).subscribe(
            (data: any) => {
              this.dialogsService.openDialogPositive(
                'Successfully, the request has been approved'
              );
              this.refreshTable();
            },
            (err: any) => {
              this.dialogsService.openDialogNegative(err.error.message);
            }
          );
        }
      });
  }

  rejectLeave(data: any, event: MouseEvent) {
    event.stopPropagation();
    data.reject = true;
    this.openDialogPendingLeaveDetail(data);
  }

  openDialogPendingLeaveDetail(data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(LeaveRequestDetailDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.refreshTable();
    });
  }
}
