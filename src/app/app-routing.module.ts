import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SignInGuard } from '../@dw/guard/signIn.guard';
import { CollaborationComponent } from './@layout/collaboration.component';
import { MngGuard } from 'src/@dw/services/leave/employee-mngmt/mng.guard';

const routes: Routes = [
    { 
        path: 'welcome',
        component: IndexComponent,
        canActivate: [SignInGuard] 
    },
    {
        path: 'sign-in',
        loadChildren: () =>
            import(`./pages/auth/auth.module`).then(m => m.AuthModule),
    },
    {
        path: 'sign-up',
        loadChildren: () =>
            import(`./pages/auth/auth.module`).then(m => m.AuthModule),
    },
    {
        path: 'find-pw',
        loadChildren: () =>
            import(`./pages/auth/auth.module`).then(m => m.AuthModule),
    },
    {
		path: '',
		component: CollaborationComponent,
		canActivate: [SignInGuard],
        children: [
			{
				path: 'main',
				loadChildren: () => import(`./pages/main/main.module`).then(m => m.MainModule),
			},
            {
                path: 'profile',
                loadChildren: () => import(`./pages/profile-edit/profile-edit.module`).then(m => m.ProfileEditModule),
            },
            {
                path: 'collab',
                loadChildren: () => import(`./pages/space/space.module`).then(m => m.SpaceModule),
            },
            {
               	path: 'leave',
                loadChildren: () => import('./pages/leave-mngmt/leave-mngmt.module').then(m => m.LeaveMngmtModule),
            },
            {
                path: 'employee-mngmt', canActivate: [ MngGuard ],
                loadChildren: () => import('./pages/employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
            },
            {
                path: 'approval-mngmt', canActivate: [ MngGuard ],
                loadChildren: () => import('./pages/approval-management/approval-management.module').then(m => m.ApprovalManagementModule)
            },
            {
                path: '',
                redirectTo: 'main',
                pathMatch: 'full'
            },
        ]
    },
    // 잘못된 URL을 사용했을때 메인으로 보냄
    {
        path: '**',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
];

@NgModule({
    // imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class ApproutingModule {}
