
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { ApprovalMngmtService } from 'src/@dw/services/leave/approval-mngmt/approval-mngmt.service';
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';
@Component({
  selector: 'app-rd-request-details',
  templateUrl: './rd-request-details.component.html',
  styleUrls: ['./rd-request-details.component.scss']
})
export class RdRequestDetailsComponent implements OnInit {

  isPending;
  viewType = {
    'annual_leave': 'Annual Leave',
    'rollover': 'Rollover',
    'sick_leave': 'Sick Leave',
    'replacement_leave': 'Replacement Day'
  }

  reject = new FormGroup({
    rejectReason: new FormControl()
  });

  constructor(
    public dialogRef: MatDialogRef<RdRequestDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public approvalMngmtService: ApprovalMngmtService,
    private dialogService: DialogService,
    private leaveMngmtService: LeaveMngmtService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.isPending = this.data.status == 'pending' ? true : false;
  }

  
  rejectLeave() {

    const formValue = this.reject.value;
    const rejectReason = formValue.rejectReason;
    this.data.rejectReason = rejectReason;
    this.dialogService.openDialogConfirm(`Do you reject the request?`).subscribe(result => {
      if (result) {
        this.approvalMngmtService.rejectReplacementRequest(this.data).subscribe(
          (data: any) => {
            // console.log('[[ delete Replacement request >>>', data);
            if (data.message == 'delete') {
              console.log(data.message);
              this.dialogService.openDialogPositive('Successfully, the request has been rejected');
            }
          }
        );
      
      }
      this.dialogRef.close();
    
    });
  }
}
