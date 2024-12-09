import { ProfilesService } from './../../../services/profiles/profiles.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LeavesService } from '../../../services/leaves/leaves.service';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ReplacementsDayRequestsDialogComponent } from '../../../components/dialogs/replacements/replacements-day-requests-dialog/replacements-day-requests-dialog.component';
import { ReplacementsLeavesRequestsDialogComponent } from '../../../components/dialogs/replacements/replacements-leaves-requests-dialog/replacements-leaves-requests-dialog.component';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { ReplacementsDaysRequestsDetailDialogComponent } from '../../../components/dialogs/replacements/replacements-days-requests-detail-dialog/replacements-days-requests-detail-dialog.component';

@Component({
  selector: 'app-replacement-requests',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './replacement-requests.component.html',
  styleUrl: './replacement-requests.component.scss'
})
export class ReplacementRequestsComponent {

  leavesService = inject(LeavesService)
  dialogsService = inject(DialogService)
  profilesService = inject(ProfilesService)
  dialog = inject(MatDialog)

  userProfileInfo: WritableSignal<any | null> = this.profilesService.userProfileInfo
  userCompanyInfo: WritableSignal<any | null> = this.profilesService.userCompanyInfo
  userManagerInfo: WritableSignal<any | null> = this.profilesService.userManagerInfo
  // view table
  displayedColumns: string[] = ['from', 'to', 'type', 'taken', 'days', 'manager', 'status', 'btns'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = signal<number>(10);
  resultsLength = signal<number>(0);
  isLoadingResults = signal<boolean>(true);
  isRateLimitReached = signal<boolean>(false);

  dataSource = signal<any[]>([])

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => this.getRdList()),
        map((res: any) => {
          this.isLoadingResults.set(false);
          if (res === null) {
            this.isRateLimitReached.set(true);
            return [];
          }
          this.isRateLimitReached.set(false);
          this.resultsLength.set(res.total_count);
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
          this.dataSource.set(data.rdList);
          if (data.rdList.length > 0) this.resultsLength.set(data.rdList.length)
        }
      });
  }

  // RD 요청
  openRdRequest() {
    const dialogRef = this.dialog.open(ReplacementsDayRequestsDialogComponent, {

      data: this.userProfileInfo()
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshRdList()
    })
  }

  // RD 휴가 요청
  openRdLeaveRequest(element: any) {
    const dialogRef = this.dialog.open(ReplacementsLeavesRequestsDialogComponent, {

      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshRdList()
    })
  }
  getRdList() {
    return this.leavesService.getRdList(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,).pipe(
        catchError(() => of(null))
      );
  }

  cancelRd(rdRequestId: any) {
    const rdObjId = {
      _id: rdRequestId
    }

    this.dialogsService.openDialogConfirm('Do you want to cancel this request?').subscribe((result: any) => {
      if (result) {
        this.leavesService.requestCancelRd(rdObjId).subscribe({
          next: (res: any) => {
            if (res.message == 'requestCancelRd') {
              this.refreshRdList()
            }
          },
          error: (err: any) => {
            console.log(err);
            this.dialogsService.openDialogNegative(err.error.message);
          }
        });
      }
    });
  }

  openDialogRdRequestDetails(data: any) {
    const dialogRef = this.dialog.open(ReplacementsDaysRequestsDetailDialogComponent, {

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

  refreshRdList(): void {
    this.getRdList().subscribe({
      next: (res: any) => {
        if (res) {
          this.dataSource.set(res.rdList);
          if (res.rdList.length > 0) this.resultsLength.set(res.rdList.length);
        }
      }
    });
  }
}
