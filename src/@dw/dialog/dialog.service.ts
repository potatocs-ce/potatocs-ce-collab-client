import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './dialog.component';
import { PositiveDialogComponent } from './dialog.component';
import { NegativeDialogComponent } from './dialog.component';
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog,
  ) { }

  // confirm
  openDialogConfirm(data): Observable<boolean> {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        content: data
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    // 	console.log(result);
    return dialogRef.afterClosed();
  }


  // positive
  openDialogPositive(data) {
    const dialogRef = this.dialog.open(PositiveDialogComponent, {
      data: {
        content: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog close');
    })
  }

  // negative
  openDialogNegative(data) {
    const dialogRef = this.dialog.open(NegativeDialogComponent, {
      data: {
        content: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog close');
    });
  }

  openDialogProgress(data){
    const dialogRef = this.dialog.open(ProgressDialogComponent,{
      data: {
        content: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog close');
    });
  }

  closeDialog(){
    this.dialog.closeAll();
  }
}
