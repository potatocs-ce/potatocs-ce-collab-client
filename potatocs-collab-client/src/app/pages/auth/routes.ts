import { Route } from "@angular/router";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { FindPwComponent } from "./find-pw/find-pw.component";
import { isLoggedInGuard } from "../../guards/is-logged-in.guard";
export const AUTH_ROUTES: Route[] = [
	{
		path: "sign-in",
		loadComponent: () => SignInComponent,
		canActivate: [isLoggedInGuard],
	},
	{
		path: "sign-up", // 회사 공휴일 or 기념일
		loadChildren: () => SignUpComponent,
		canActivate: [isLoggedInGuard],
	},
	{
		path: "requests", // 휴가 요청 목록
		loadChildren: () => FindPwComponent,
		canActivate: [isLoggedInGuard],
	},
];
