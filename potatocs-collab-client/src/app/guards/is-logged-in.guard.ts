import { effect, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { DialogService } from "../stores/dialog/dialog.service";

export const isLoggedInGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const dialogService = inject(DialogService);
    const router = inject(Router);
    const routePath = route.routeConfig?.path ?? ""; // ?? 은 타입스크립트 문법으로 undefined || null 이면 ''로 주겠다.
    // const isLoggedIn = window.localStorage.getItem('isLoggedIn')
    const isLoggedIn = authService.isAuthenticated();
    // if (authService.isLoggedIn()) {
    //   // 로그인이 되어있으면
    //   // 회원가입, 로그인, 비밀번호 찾기, 소개페이지는 전부
    //   // 메인페이지로 이동
    //   if (['sign-in', 'find-pw', 'sign-up'].includes(routePath)) {
    //     router.navigate(['main']);
    //   }
    //   return true;
    // } else {
    //   // 로그인이 안되어있으면
    //   // 회원가입, 로그인, 비밀번호 찾기, 소개페이지는 전부 그대로 이동
    //   // dialogService.openDialogNegative('Please login first');
    //   if (['sign-in', 'sign-up', 'find-pw'].includes(routePath)) {
    //     return true;
    //     // uri가 없거나 메인페이지는 소개페이지로
    //   } else {
    //     // 그외 나머지 페이지는 signin으로
    //     router.navigate(['sign-in'], { queryParams: { redirectURL: state.url } });
    //   }
    //   return true;
    // }
    if (!isLoggedIn) {
        console.log("로그인 안됌", routePath);
        console.log("로그인 안됌", state.url);
        if (routePath == "intro" || routePath == "sign-in" || routePath == "sign-up" || routePath == "find-pw") {
            return true;
        } else if (routePath == "" && state.url == "/main") {
            router.navigate(["intro"]);
        } else {
            dialogService.openDialogNegative("Please login first");
            router.navigate(["sign-in"], { queryParams: { redirectURL: state.url } });
        }
        return true;

    } else {
        console.log("else : ", routePath);
        if (routePath == "sign-in") {
            router.navigate(["main"]);
            return true;
        } else if (routePath == "intro") {
            router.navigate(["main"]);
            return true;
        } else if (routePath == "find-pw") {
            router.navigate(["main"]);
            return true;
        } else if (routePath == "sign-up") {
            router.navigate(["main"]);
            return true;
        } else {
            return true;
        }
    }
};
