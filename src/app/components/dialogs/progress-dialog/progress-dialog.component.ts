import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialsModule } from "../../../materials/materials.module";
import { CommonModule } from "@angular/common";
@Component({
	selector: "app-progress-dialog",
	templateUrl: "./progress-dialog.component.html",
	imports: [MaterialsModule, CommonModule],
	standalone: true,
	styleUrls: ["./progress-dialog.component.scss"],
})
export class ProgressDialogComponent implements OnInit {
	constructor(public dialogRef: MatDialogRef<ProgressDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

	ngOnInit(): void {}
}
