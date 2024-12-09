import { Route } from '@angular/router';
import { RequestsComponent } from './requests.component';
import { LeavesRequestsAddComponent } from './leaves-requests-add/leaves-requests-add.component';




export const REQUESTS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => RequestsComponent,
  },
  {
    path: 'add', // 회사 공휴일 or 기념일
    loadComponent: () => LeavesRequestsAddComponent,
  },

];
