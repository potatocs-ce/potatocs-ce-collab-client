import { Injectable, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NegativeDialogComponent } from "../../components/dialogs/negative-dialog/negative-dialog.component";
import { PositiveDialogComponent } from "../../components/dialogs/positive-dialog/positive-dialog.component";
import { ConfirmDialogComponent } from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import { ProgressDialogComponent } from "../../components/dialogs/progress-dialog/progress-dialog.component";

@Injectable({
	providedIn: "root",
})
export class DialogService {
	public dialog = inject(MatDialog);

	constructor() {}

	// confirm
	openDialogConfirm(data: any) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: {
				content: data,
			},
		});

		// dialogRef.afterClosed().subscribe(result => {
		// 	console.log(result);
		return dialogRef.afterClosed();
	}

	// positive
	openDialogPositive(data: any) {
		const dialogRef = this.dialog.open(PositiveDialogComponent, {
			data: {
				content: data,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("dialog close");
		});
	}

	// negative
	openDialogNegative(data: any) {
		const dialogRef = this.dialog.open(NegativeDialogComponent, {
			data: {
				content: data,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("dialog close");
		});
	}

	openDialogProgress(data) {
		const dialogRef = this.dialog.open(ProgressDialogComponent, {
			data: {
				content: data,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("dialog close");
		});
	}
	closeDialog() {
		this.dialog.closeAll();
	}
}
