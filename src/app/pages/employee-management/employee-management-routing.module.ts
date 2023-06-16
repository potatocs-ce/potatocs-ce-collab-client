import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployeeInfoComponent } from './edit-employee-info/edit-employee-info.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { PendingEmployeeComponent } from './pending-employee/pending-employee.component';
import { EmployeeLeaveStatusComponent } from './employee-leave-status/employee-leave-status.component';
import { EmployeeRdRequestComponent } from './employee-rd-request/employee-rd-request.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'register-request',
				component: PendingEmployeeComponent,
			},
			{
				path: 'employee-list',
				component: EmployeeListComponent
			},
			{
				path: 'manager-list',
				component: EmployeeListComponent
			},
			{
				path: 'edit-info/:id',
				component: EditEmployeeInfoComponent
			},
			{
				path: 'employee-leave-status',
				component: EmployeeLeaveStatusComponent
			},
			{
				path: 'employee-rd-request',
				component: EmployeeRdRequestComponent
			},
		]
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
