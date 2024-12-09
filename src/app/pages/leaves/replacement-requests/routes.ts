import { Route } from '@angular/router';
import { ReplacementRequestsComponent } from './replacement-requests.component';
import { ReplacementRequestsAddComponent } from './replacement-requests-add/replacement-requests-add.component';



export const REPLACEMENT_REQUESTS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => ReplacementRequestsComponent,
  },
  {
    path: 'add', // 회사 공휴일 or 기념일
    loadComponent: () => ReplacementRequestsAddComponent,
  },

];
