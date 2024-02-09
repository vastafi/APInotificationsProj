import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SavingGoalComponent } from './list/saving-goal.component';
import { SavingGoalDetailComponent } from './detail/saving-goal-detail.component';
import { SavingGoalUpdateComponent } from './update/saving-goal-update.component';
import SavingGoalResolve from './route/saving-goal-routing-resolve.service';

const savingGoalRoute: Routes = [
  {
    path: '',
    component: SavingGoalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SavingGoalDetailComponent,
    resolve: {
      savingGoal: SavingGoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SavingGoalUpdateComponent,
    resolve: {
      savingGoal: SavingGoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SavingGoalUpdateComponent,
    resolve: {
      savingGoal: SavingGoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default savingGoalRoute;
