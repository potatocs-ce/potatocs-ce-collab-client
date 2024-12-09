import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialsModule } from "../../../../materials/materials.module";
@Component({
	selector: "app-space-add-status-dialog",
	standalone: true,
	imports: [MaterialsModule],
	templateUrl: "./space-add-status-dialog.component.html",
	styleUrl: "./space-add-status-dialog.component.scss",
})
export class SpaceAddStatusDialogComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<SpaceAddStatusDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}
	ngOnInit(): void {
		console.log("스크럼보드 리스트 : ");
	}
}
