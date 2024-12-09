import { Routes } from "@angular/router";
import { LayoutComponent } from "./components/layout/layout.component";
import { SignInComponent } from "./pages/auth/sign-in/sign-in.component";
import { IndexComponent } from "./pages/index/index.component";
import { isLoggedInGuard } from "./guards/is-logged-in.guard";

export const routes: Routes = [
	{
		path: "intro",
		component: IndexComponent,
		canActivate: [isLoggedInGuard],
	},
	{
		path: "sign-in",
		loadComponent: () => import("./pages/auth/sign-in/sign-in.component").then((m) => m.SignInComponent),
		canActivate: [isLoggedInGuard],
	},
	{
		path: "sign-up",
		loadComponent: () => import("./pages/auth/sign-up/sign-up.component").then((m) => m.SignUpComponent),
		canActivate: [isLoggedInGuard],
	},
	{
		path: "find-pw",
		loadComponent: () => import("./pages/auth/find-pw/find-pw.component").then((m) => m.FindPwComponent),
		canActivate: [isLoggedInGuard],
	},
	{
		path: "",
		component: LayoutComponent,
		canActivate: [isLoggedInGuard],
		children: [
			{
				path: "main",
				loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
			},
			{
				path: "leaves",
				loadChildren: () => import("./pages/leaves/routes").then((m) => m.LEAVES_ROUTES),
			},
			{
				path: "employees",
				loadChildren: () => import("./pages/employees/routes").then((m) => m.EMPLOYEES_ROUTES),
			},
			{
				path: "space",
				loadChildren: () => import("./pages/spaces/routes").then((m) => m.SPACES_ROUTES),
			},
			{
				path: "chat",
				loadChildren: () => import("./pages/chat/routes").then((m) => m.CHAT_ROUTES),
			},
			{
				path: "documents",
				loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
			},
			{
				path: "profile",
				loadComponent: () =>
					import(`./pages/profile-edit/profile-edit.component`).then((m) => m.ProfileEditComponent),
			},
			{
				path: "",
				redirectTo: "main",
				pathMatch: "full",
			},
		],
	},
	// 잘못된 URL을 사용했을때 메인으로 보냄
	{
		path: "**",
		// redirectTo: 'welcome',
		redirectTo: "intro",
		pathMatch: "full",
	},
];
