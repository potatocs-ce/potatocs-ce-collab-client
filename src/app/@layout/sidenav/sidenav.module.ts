import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './sidenav.component';
import { RouterModule } from '@angular/router';
import { SidenavItemModule } from 'src/@dw/components/sidenav-item.module';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';



@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    NgMaterialUIModule,
    RouterModule,
    SidenavItemModule
  ],
  exports: [SidenavComponent]
})
export class SidenavModule { }
