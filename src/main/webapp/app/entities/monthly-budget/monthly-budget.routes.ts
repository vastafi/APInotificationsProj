import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MonthlyBudgetComponent } from './list/monthly-budget.component';
import { MonthlyBudgetDetailComponent } from './detail/monthly-budget-detail.component';
import { MonthlyBudgetUpdateComponent } from './update/monthly-budget-update.component';
import MonthlyBudgetResolve from './route/monthly-budget-routing-resolve.service';

const monthlyBudgetRoute: Routes = [
  {
    path: '',
    component: MonthlyBudgetComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MonthlyBudgetDetailComponent,
    resolve: {
      monthlyBudget: MonthlyBudgetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MonthlyBudgetUpdateComponent,
    resolve: {
      monthlyBudget: MonthlyBudgetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MonthlyBudgetUpdateComponent,
    resolve: {
      monthlyBudget: MonthlyBudgetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default monthlyBudgetRoute;
