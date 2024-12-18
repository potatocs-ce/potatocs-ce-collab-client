import { Route } from '@angular/router';

export const EMPLOYEES_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'employees/list',
    pathMatch: 'full',
  },
];
