import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core'
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavItemComponent } from './sidenav-item.component';



@NgModule({
  declarations: [
    SidenavItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatRippleModule,
    FlexLayoutModule,
  ],
  exports: [SidenavItemComponent]
})
export class SidenavItemModule { }
