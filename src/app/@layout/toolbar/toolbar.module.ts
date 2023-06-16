import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

// material
import { ToolbarComponent } from './toolbar.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    NgMaterialUIModule,
    RouterModule
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule { }