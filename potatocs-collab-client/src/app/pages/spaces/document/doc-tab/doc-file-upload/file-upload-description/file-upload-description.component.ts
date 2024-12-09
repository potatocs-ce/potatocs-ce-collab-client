import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialsModule } from "../../../../../../materials/materials.module";

@Component({
	selector: "app-file-upload-description",
	templateUrl: "./file-upload-description.component.html",
	styleUrls: ["./file-upload-description.component.scss"],
	standalone: true,
	imports: [MaterialsModule],
})
export class FileUploadDescriptionComponent implements OnInit {
	fileUpload: FormGroup = new FormGroup({
		description: new FormControl(),
	});

	constructor(
		public dialogRef: MatDialogRef<FileUploadDescriptionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {}

	descriptionMade() {
		const formValue = this.fileUpload.value;
		const description = formValue.description;
		this.data.description = description;

		this.dialogRef.close(this.data);
	}
}
