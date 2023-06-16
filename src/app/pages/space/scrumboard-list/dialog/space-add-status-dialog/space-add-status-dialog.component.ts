import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-space-add-status-dialog',
    templateUrl: './space-add-status-dialog.component.html',
    styleUrls: ['./space-add-status-dialog.component.scss']
})
export class SpaceAddStatusDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<SpaceAddStatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        console.log(this.data);
    }

}
