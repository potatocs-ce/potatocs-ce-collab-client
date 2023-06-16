import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DialogService } from '../dialog/dialog.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class SignInGuard implements CanActivate, OnInit {

	constructor(
		private router: Router,
		private auth: AuthService,
		private dialogService: DialogService
		) {

	}

	ngOnInit() {
		console.log('auth guard oninit');
	}
	
	// https://stackoverflow.com/questions/42719445/pass-parameter-into-route-guard
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		// 토큰 만료 혹은 종료 시 login page로 돌아감.
		const routePath = route.routeConfig.path;
		if (!this.auth.isAuthenticated()) {
			if (routePath == 'welcome' || routePath == 'sign-in' || routePath == 'sign-up' || routePath == 'find-pw') {
				return true;
			} 
			else if(routePath == '' && state.url == '/main'){
				this.router.navigate(['welcome']);
			}
			else {
				this.dialogService.openDialogNegative('Please login first');
				this.router.navigate(['sign-in'],{queryParams:{'redirectURL':state.url}});
			}
			
			return true;
		} else {
			if (routePath == 'sign-in') {
				this.router.navigate(['main']);
				return true;
			} else if (routePath == 'welcome') {
				this.router.navigate(['main']);
				return true;
			} else if (routePath == 'find-pw') {
				this.router.navigate(['main']);
				return true;
			} else if (routePath == 'sign-up') {
				this.router.navigate(['main']);
				return true;
			} else {
				return true;
			}
		}
	}
}
