import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgMaterialUIModule
  ]
})
export class MainModule { }
