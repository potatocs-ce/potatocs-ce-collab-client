import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { DialogService } from '../stores/dialog/dialog.service';

export const isLoggedInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const dialogService = inject(DialogService);
  const router = inject(Router);
  const routePath = route.routeConfig?.path ?? ''; // ?? 은 타입스크립트 문법으로 undefined || null 이면 ''로 주겠다.
  const isLoggedIn = authService.isAuthenticated();

  if (!isLoggedIn) {
    if (
      routePath == 'intro' ||
      routePath == 'sign-in' ||
      routePath == 'sign-up' ||
      routePath == 'find-pw'
    ) {
      return true;
    } else if (routePath == '' && state.url == '/main') {
      router.navigate(['intro']);
    } else {
      dialogService.openDialogNegative('Please login first');
      router.navigate(['sign-in'], { queryParams: { redirectURL: state.url } });
    }
    return true;
  } else {
    if (routePath == 'sign-in') {
      router.navigate(['main']);
      return true;
    } else if (routePath == 'intro') {
      router.navigate(['main']);
      return true;
    } else if (routePath == 'find-pw') {
      router.navigate(['main']);
      return true;
    } else if (routePath == 'sign-up') {
      router.navigate(['main']);
      return true;
    } else {
      return true;
    }
  }
};
