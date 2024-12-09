import { Route } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { LeavesRequestsComponent } from './leaves-requests/leaves-requests.component';
import { LeavesStatusComponent } from './leaves-status/leaves-status.component';
import { ManagersConnectionComponent } from './managers-connection/managers-connection.component';
import { ReplacementDaysComponent } from './replacement-days/replacement-days.component';




export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: 'list', // 직원 리스트
    loadComponent: () => EmployeesListComponent,
  },
  {
    path: 'leaves/status', // 직원들 휴가 사용 목록
    loadComponent: () => LeavesStatusComponent,
  },
  {
    path: 'leaves/requests', // 직원들 휴가 요청 목록 
    loadComponent: () => LeavesRequestsComponent,
  },
  {
    path: 'leaves/replacement-requests', // 직원들 대체 휴일 요청 (휴일에 근무 시 대체휴가 요청 목록)
    loadComponent: () => ReplacementDaysComponent,
  },
  {
    path: 'registration/requests', // 직원들이 담당 매니저와의 연결 요청 목록
    loadComponent: () => ManagersConnectionComponent,
  },
  {
    path: '',
    redirectTo: 'employees/list',
    pathMatch: 'full',
  }
];
