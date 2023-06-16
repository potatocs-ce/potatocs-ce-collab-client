import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalManagementRoutingModule } from './approval-management-routing.module';
import { PendingLeaveComponent } from './pending-leave/pending-leave.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';

@NgModule({
  declarations: [
    PendingLeaveComponent,
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
    ApprovalManagementRoutingModule
  ]
})
export class ApprovalManagementModule { }
