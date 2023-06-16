import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss']
})
export class ProgressDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}