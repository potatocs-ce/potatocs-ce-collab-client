import { Route } from '@angular/router';
import { RequestsComponent } from './requests.component';

export const REQUESTS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => RequestsComponent,
  },
];
