import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileEditRoutingModule } from './profile-edit-routing.module';
import { ProfileEditComponent } from './profile-edit.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';


@NgModule({
  declarations: [
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    ProfileEditRoutingModule,
    NgMaterialUIModule
  ]
})
export class ProfileEditModule { }
