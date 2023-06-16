import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgMaterialUIModule } from './ng-material-ui/ng-material-ui.module';

// Module
import { AuthModule } from './pages/auth/auth.module';
import { ApproutingModule } from './app-routing.module';

// Config
import { ENV } from '../@dw/config/config';

// Guard
import { SignInGuard } from '../@dw/guard/signIn.guard';
import { MngGuard } from '../@dw/services/leave/employee-mngmt/mng.guard';
import { SpaceGuard } from 'src/@dw/guard/space.guard';

// Component
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';
// import { LeaveMngmtModule } from './components/leave-mngmt/leave-mngmt.module';
import { CollaborationModule } from '../app/@layout/collaboration.module'
import { DialogModule } from '../@dw/dialog/dialog.modules'
import { CollaborationComponent } from './@layout/collaboration.component';
import { ToolbarModule } from './@layout/toolbar/toolbar.module';
import { SidenavModule } from './@layout/sidenav/sidenav.module';
import { RdRequestDetailsComponent } from './components/rd-request-details/rd-request-details.component';

import { CalendarModule } from 'angular-calendar';

export function tokenGetter() {
	return localStorage.getItem(ENV.tokenName);
}
@NgModule({
    declarations: [
      AppComponent,
      IndexComponent,
      CollaborationComponent,
      RdRequestDetailsComponent
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      NgMaterialUIModule,
      FormsModule,
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          disallowedRoutes: [
            '/api/v1/auth/sign-in',
		        '/api/v1/auth/sign-up',
          ]
        }
      }),
      AuthModule,
      CollaborationModule,
      DialogModule,
      ToolbarModule,
      SidenavModule,
      ApproutingModule,
      CalendarModule
    ],
    providers: [SignInGuard, MngGuard, SpaceGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
