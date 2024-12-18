import { Route } from '@angular/router';
import { ReplacementRequestsComponent } from './replacement-requests.component';

export const REPLACEMENT_REQUESTS_ROUTES: Route[] = [
  {
    path: '', // 회사 공휴일 or 기념일
    loadComponent: () => ReplacementRequestsComponent,
  },
];
