import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveMngmtRoutingModule } from './leave-mngmt-routing.module';
import { LeaveMngmtComponent } from './leave-mngmt.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { RequestLeaveListComponent } from './request-leave-list/request-leave-list.component';
import { RequestLeaveComponent } from './request-leave/request-leave.component';
import { MainComponent } from './main/main.component';
import { LeaveRequestDetailsComponent } from '../../components/leave-request-details/leave-request-details.component';
import { ReplacementDayRequestComponent } from './replacement-day-request/replacement-day-request.component';
import { RdRequestListComponent } from './rd-request-list/rd-request-list.component';
import { ReplacementLeaveRequestComponent } from './replacement-leave-request/replacement-leave-request.component';



@NgModule({
	declarations: [
		LeaveMngmtComponent,
		RequestLeaveListComponent,
		RequestLeaveComponent,
		MainComponent,
		LeaveRequestDetailsComponent,
  		ReplacementDayRequestComponent,
    	RdRequestListComponent,
     ReplacementLeaveRequestComponent,
	],
	imports: [
		CommonModule,
		NgMaterialUIModule,
		LeaveMngmtRoutingModule,
	],
	providers: [
	]
})
export class LeaveMngmtModule { }
