import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { PendingEmployeeComponent } from './pending-employee/pending-employee.component';
import { EditEmployeeInfoComponent } from './edit-employee-info/edit-employee-info.component';
import { EmployeeLeaveStatusComponent } from './employee-leave-status/employee-leave-status.component';
import { MatInputModule } from '@angular/material/input';
import { EmployeeRdRequestComponent } from './employee-rd-request/employee-rd-request.component';


@NgModule({
	declarations: [
		EmployeeListComponent,
		PendingEmployeeComponent,
		EditEmployeeInfoComponent,
  		EmployeeLeaveStatusComponent,
    EmployeeRdRequestComponent
	],
	imports: [
		CommonModule,
		NgMaterialUIModule,
		EmployeeManagementRoutingModule,
		MatInputModule
	],
	exports: [
        MatInputModule
    ]
})
export class EmployeeManagementModule { }
