import { ApprovalService } from "./../../../services/approval/approval.service";
import { LeavesService } from "./../../../services/leaves/leaves.service";
import { LeaveRequest } from "./../../../interfaces/leave-request.interface";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MaterialsModule } from "../../../materials/materials.module";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogService } from "../../../stores/dialog/dialog.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
	selector: "app-leave-request-detail-dialog",
	standalone: true,
	imports: [CommonModule, MaterialsModule],
	templateUrl: "./leave-request-detail-dialog.component.html",
	styleUrl: "./leave-request-detail-dialog.component.scss",
})
export class LeaveRequestDetailDialogComponent {
	public dialogRef: MatDialogRef<LeaveRequestDetailDialogComponent> = inject(
		MatDialogRef<LeaveRequestDetailDialogComponent>
	);
	public data = inject(MAT_DIALOG_DATA);
	leavesService = inject(LeavesService);
	dialogService = inject(DialogService);
	approvalService = inject(ApprovalService);
	isPending = this.data.status == "pending" ? true : false;

	rejectForm: FormGroup = new FormGroup({
		rejectReason: new FormControl(),
	});

	viewType: any = {
		annual_leave: "Annual Leave",
		rollover: "Rollover",
		sick_leave: "Sick Leave",
		replacement_leave: "Replacement Day",
	};
	constructor() {
		console.log(this.data);
	}
	// 휴가 reject
	rejectLeave() {
		const rejectReason = this.rejectForm.value.rejectReason;
		this.data.rejectReason = rejectReason;

		this.dialogService.openDialogConfirm("Do you reject the leave request?").subscribe((result) => {
			if (result) {
				this.approvalService.rejectLeaveRequest(this.data).subscribe({
					next: (data: any) => {
						console.log("[[ delete leave request >>>", data);
						if (data.message === "delete") {
							this.dialogService.openDialogPositive("Successfully, the request has been rejected");
						}
						this.dialogRef.close();
					},
					error: (error) => {
						console.error("Error deleting leave request:", error);
						this.dialogRef.close();
					},
				});
			} else {
				this.dialogRef.close();
			}
		});
	}

	// employee request leave cancel
	requestCancel() {
		this.dialogService.openDialogConfirm("Do you cancel the leave request?").subscribe((result) => {
			if (result) {
				this.leavesService.cancelMyRequestLeave(this.data).subscribe({
					next: (data: any) => {
						this.dialogService.openDialogPositive("Successfully, the request has been canceled");
						this.dialogRef.close();
					},
					error: (error) => {
						console.error("Error canceling leave request:", error);
						this.dialogRef.close();
					},
				});
			} else {
				this.dialogRef.close();
			}
		});
	}

	// The manager cancels the employee's approved leave.
	approveLeaveCancel() {
		this.dialogService.openDialogConfirm("Do you cancel the leave request?").subscribe((result) => {
			if (result) {
				this.approvalService.cancelEmployeeApproveLeave(this.data).subscribe({
					next: (data: any) => {
						console.log(data);
						this.dialogService.openDialogPositive("Successfully, the request has been canceled");
						this.dialogRef.close();
					},
					error: (error) => {
						console.error("Error approving leave cancellation:", error);
						this.dialogRef.close();
					},
				});
			} else {
				this.dialogRef.close();
			}
		});
	}
}
