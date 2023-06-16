import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingLeaveComponent } from './pending-leave/pending-leave.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'leave-request',
				component: PendingLeaveComponent,
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ApprovalManagementRoutingModule { }
