// MODULE
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';

// COMPONENT
import { ManagerComponent } from '../pages/main/main.component';
import { CompanyComponent } from '../pages/main/main.component';

@NgModule({
  declarations: [
    ManagerComponent,
    CompanyComponent,
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
  ],
})
export class CollaborationModule { }
