import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExpenseComponent } from './list/expense.component';
import { ExpenseDetailComponent } from './detail/expense-detail.component';
import { ExpenseUpdateComponent } from './update/expense-update.component';
import ExpenseResolve from './route/expense-routing-resolve.service';

const expenseRoute: Routes = [
  {
    path: '',
    component: ExpenseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExpenseDetailComponent,
    resolve: {
      expense: ExpenseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExpenseUpdateComponent,
    resolve: {
      expense: ExpenseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExpenseUpdateComponent,
    resolve: {
      expense: ExpenseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default expenseRoute;
