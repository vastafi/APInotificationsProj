import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExpense } from '../expense.model';
import { ExpenseService } from '../service/expense.service';

export const expenseResolve = (route: ActivatedRouteSnapshot): Observable<null | IExpense> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExpenseService)
      .find(id)
      .pipe(
        mergeMap((expense: HttpResponse<IExpense>) => {
          if (expense.body) {
            return of(expense.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default expenseResolve;
