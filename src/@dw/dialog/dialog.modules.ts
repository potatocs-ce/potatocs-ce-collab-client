import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogComponent } from './dialog.component';
import { ConfirmDialogComponent } from './dialog.component';
import { PositiveDialogComponent } from './dialog.component';
import { NegativeDialogComponent } from './dialog.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';

@NgModule({
  declarations: [
    DialogComponent,
    ConfirmDialogComponent,
    PositiveDialogComponent,
    NegativeDialogComponent,
    ProgressDialogComponent
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule
  ]
})

export class DialogModule { }
