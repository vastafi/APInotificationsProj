import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExpenseCategory } from '../expense-category.model';
import { ExpenseCategoryService } from '../service/expense-category.service';

export const expenseCategoryResolve = (route: ActivatedRouteSnapshot): Observable<null | IExpenseCategory> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExpenseCategoryService)
      .find(id)
      .pipe(
        mergeMap((expenseCategory: HttpResponse<IExpenseCategory>) => {
          if (expenseCategory.body) {
            return of(expenseCategory.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default expenseCategoryResolve;
