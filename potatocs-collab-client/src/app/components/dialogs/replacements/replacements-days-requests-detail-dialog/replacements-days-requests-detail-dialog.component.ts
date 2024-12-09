import { Component, inject, Inject } from '@angular/core';
import { MaterialsModule } from '../../../../materials/materials.module';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../../stores/dialog/dialog.service';
import { ApprovalService } from '../../../../services/approval/approval.service';
import { LeavesService } from '../../../../services/leaves/leaves.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-replacements-days-requests-detail-dialog',
  standalone: true,
  imports: [MaterialsModule, CommonModule],
  templateUrl: './replacements-days-requests-detail-dialog.component.html',
  styleUrl: './replacements-days-requests-detail-dialog.component.scss',
})
export class ReplacementsDaysRequestsDetailDialogComponent {
  approvalService = inject(ApprovalService);

  isPending;
  viewType = {
    annual_leave: 'Annual Leave',
    rollover: 'Rollover',
    sick_leave: 'Sick Leave',
    replacement_leave: 'Replacement Day',
  };

  reject = new FormGroup({
    rejectReason: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<ReplacementsDaysRequestsDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leavesService: LeavesService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.isPending = this.data.status == 'pending' ? true : false;
  }

  rejectLeave() {
    const formValue = this.reject.value;
    const rejectReason = formValue.rejectReason;
    this.data.rejectReason = rejectReason;
    this.dialogService
      .openDialogConfirm(`Do you reject the request?`)
      .subscribe((result) => {
        if (result) {
          this.approvalService
            .rejectReplacementRequest(this.data)
            .subscribe((data: any) => {
              // console.log('[[ delete Replacement request >>>', data);
              if (data.message == 'delete') {
                console.log(data.message);
                this.dialogService.openDialogPositive(
                  'Successfully, the request has been rejected'
                );
              }
            });
        }
        this.dialogRef.close();
      });
  }

  // employee request leave cancel
  requestCancel() {
    this.dialogService
      .openDialogConfirm(`Do you cancel the leave request?`)
      .subscribe((result) => {
        // console.log(result)
        if (result) {
          // console.log(this.data)
          this.leavesService
            .cancelMyRequestLeave(this.data)
            .subscribe((data: any) => {
              // console.log(data);
              this.dialogService.openDialogPositive(
                'Successfully, the request has been canceled'
              );
              this.dialogRef.close();
            });
        }
      });
  }

  // The manager cancels the employee's approved leave.
  approveLeaveCancel() {
    this.dialogService
      .openDialogConfirm(`Do you cancel the leave request?`)
      .subscribe((result) => {
        if (result) {
          // console.log('approve leave cancel')
          this.approvalService
            .cancelEmployeeApproveLeave(this.data)
            .subscribe((data: any) => {
              console.log(data);
              this.dialogService.openDialogPositive(
                'Successfully, the request has been canceled'
              );
              this.dialogRef.close();
            });
        }
      });
  }
}
