import { Route } from '@angular/router';
import { StatusComponent } from './status/status.component';
import { LeavesComponent } from './leaves.component';

export const LEAVES_ROUTES: Route[] = [
  {
    // 이정운 작업
    // path: 'status', // 휴가 사용 현황
    // loadComponent: () => StatusComponent
    path: 'my-status',
    loadComponent: () => StatusComponent,
  },
];
