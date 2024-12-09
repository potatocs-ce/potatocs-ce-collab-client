import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { ApprovalService } from '../../../services/approval/approval.service';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../../../materials/materials.module';
import { LeavesService } from '../../../services/leaves/leaves.service';

@Component({
  selector: 'app-rd-requests-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './rd-requests-details-dialog.component.html',
  styleUrl: './rd-requests-details-dialog.component.scss',
})
export class RdRequestsDetailsDialogComponent {
  approvalService = inject(ApprovalService);
  leavesService = inject(LeavesService);

  isPending;
  viewType = {
    annual_leave: 'Annual Leave',
    rollover: 'Rollover',
    sick_leave: 'Sick Leave',
    replacement_leave: 'Replacement Day',
  };

  reject: any = new FormGroup({
    rejectReason: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<RdRequestsDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

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
          this.leavesService
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
