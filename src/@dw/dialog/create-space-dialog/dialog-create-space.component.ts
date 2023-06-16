import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
	selector: 'dialog-create-space',
	templateUrl: './dialog-create-space.component.html',
	styleUrls: ['./dialog-create-space.component.scss']
})
export class DialogCreateSpaceComponent {
	

	constructor(
		public spaceDialogRef: MatDialogRef<DialogCreateSpaceComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }


	onNoClick(): void {
		
		this.spaceDialogRef.close();
	}
}
