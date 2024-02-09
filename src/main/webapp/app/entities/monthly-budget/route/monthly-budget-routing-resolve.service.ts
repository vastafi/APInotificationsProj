import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMonthlyBudget } from '../monthly-budget.model';
import { MonthlyBudgetService } from '../service/monthly-budget.service';

export const monthlyBudgetResolve = (route: ActivatedRouteSnapshot): Observable<null | IMonthlyBudget> => {
  const id = route.params['id'];
  if (id) {
    return inject(MonthlyBudgetService)
      .find(id)
      .pipe(
        mergeMap((monthlyBudget: HttpResponse<IMonthlyBudget>) => {
          if (monthlyBudget.body) {
            return of(monthlyBudget.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default monthlyBudgetResolve;
