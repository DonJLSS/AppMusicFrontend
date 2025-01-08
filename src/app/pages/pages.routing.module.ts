import { Routes } from '@angular/router';
import { AppDashboardComponent } from './explore/explore.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: AppDashboardComponent,
    data: {
      title: 'Starter Page',
    },
  },
];
