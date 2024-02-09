import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISavingGoal } from '../saving-goal.model';
import { SavingGoalService } from '../service/saving-goal.service';

export const savingGoalResolve = (route: ActivatedRouteSnapshot): Observable<null | ISavingGoal> => {
  const id = route.params['id'];
  if (id) {
    return inject(SavingGoalService)
      .find(id)
      .pipe(
        mergeMap((savingGoal: HttpResponse<ISavingGoal>) => {
          if (savingGoal.body) {
            return of(savingGoal.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default savingGoalResolve;
