import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExpenseCategoryComponent } from './list/expense-category.component';
import { ExpenseCategoryDetailComponent } from './detail/expense-category-detail.component';
import { ExpenseCategoryUpdateComponent } from './update/expense-category-update.component';
import ExpenseCategoryResolve from './route/expense-category-routing-resolve.service';

const expenseCategoryRoute: Routes = [
  {
    path: '',
    component: ExpenseCategoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExpenseCategoryDetailComponent,
    resolve: {
      expenseCategory: ExpenseCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExpenseCategoryUpdateComponent,
    resolve: {
      expenseCategory: ExpenseCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExpenseCategoryUpdateComponent,
    resolve: {
      expenseCategory: ExpenseCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default expenseCategoryRoute;
