import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FindPwComponent } from './find-pw/find-pw.component';

@NgModule({
    declarations: [
        SignInComponent,
        SignUpComponent,
        FindPwComponent
    ],
    imports: [
        CommonModule, 
        NgMaterialUIModule,
        AuthRoutingModule
    ],
})
export class AuthModule {}
