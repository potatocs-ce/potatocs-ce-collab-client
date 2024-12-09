import { Route } from "@angular/router";
import { LeavesRequestsAddComponent } from "./requests/leaves-requests-add/leaves-requests-add.component";
import { StatusComponent } from "./status/status.component";
import { LeavesComponent } from "./leaves.component";
import { ReplacementRequestsComponent } from "./replacement-requests/replacement-requests.component";

export const LEAVES_ROUTES: Route[] = [
	{
		// 이정운 작업
		// path: 'status', // 휴가 사용 현황
		// loadComponent: () => StatusComponent
		path: "my-status",
		loadComponent: () => StatusComponent,
	},
	{
		path: "requests", // 회사 공휴일 or 기념일
		loadChildren: () => import("./requests/routes").then((m) => m.REQUESTS_ROUTES),
	},
	{
		path: "requests", // 휴가 요청 목록
		loadChildren: () => import("./requests/routes").then((m) => m.REQUESTS_ROUTES),
	},
	{
		path: "rd-request-list",
		loadComponent: () => ReplacementRequestsComponent,
	},
];
