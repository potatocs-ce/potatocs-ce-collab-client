import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialsModule } from "../../../materials/materials.module";

@Component({
    selector: "dialog-create-space",
    standalone: true,
    templateUrl: "./dialog-create-space.component.html",
    imports: [CommonModule, MaterialsModule],
    styleUrls: ["./dialog-create-space.component.scss"],
})
export class DialogCreateSpaceComponent {
    constructor(
        public spaceDialogRef: MatDialogRef<DialogCreateSpaceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    faceOption = false;
    faceOptionColor = 'accent'

    onNoClick(): void {
        this.spaceDialogRef.close();
    }
}
