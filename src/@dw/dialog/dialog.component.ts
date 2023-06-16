import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  flag: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.data.flag = true;
  }

  closeModal(){
    this.data.flag = false;
    this.dialogRef.close();
  }
}

// positive
@Component({
  selector: 'app-positive-dialog',
  templateUrl: './positive-dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class PositiveDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PositiveDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.dialogRef.close();
  }

}

//negative
@Component({
  selector: 'app-negative-dialog',
  templateUrl: './negative-dialog-component.html',
  styleUrls: ['./dialog.component.scss']
})
export class NegativeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NegativeDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.dialogRef.close();
  }

}

