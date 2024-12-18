import { Route } from '@angular/router';
import { ReplacementDaysComponent } from './replacement-days/replacement-days.component';

export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: 'leaves/replacement-requests', // 직원들 대체 휴일 요청 (휴일에 근무 시 대체휴가 요청 목록)
    loadComponent: () => ReplacementDaysComponent,
  },
  {
    path: '',
    redirectTo: 'employees/list',
    pathMatch: 'full',
  },
];
