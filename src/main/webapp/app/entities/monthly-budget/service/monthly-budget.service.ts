import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMonthlyBudget, NewMonthlyBudget } from '../monthly-budget.model';

export type PartialUpdateMonthlyBudget = Partial<IMonthlyBudget> & Pick<IMonthlyBudget, 'id'>;

export type EntityResponseType = HttpResponse<IMonthlyBudget>;
export type EntityArrayResponseType = HttpResponse<IMonthlyBudget[]>;

@Injectable({ providedIn: 'root' })
export class MonthlyBudgetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/monthly-budgets');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(monthlyBudget: NewMonthlyBudget): Observable<EntityResponseType> {
    return this.http.post<IMonthlyBudget>(this.resourceUrl, monthlyBudget, { observe: 'response' });
  }

  update(monthlyBudget: IMonthlyBudget): Observable<EntityResponseType> {
    return this.http.put<IMonthlyBudget>(`${this.resourceUrl}/${this.getMonthlyBudgetIdentifier(monthlyBudget)}`, monthlyBudget, {
      observe: 'response',
    });
  }

  partialUpdate(monthlyBudget: PartialUpdateMonthlyBudget): Observable<EntityResponseType> {
    return this.http.patch<IMonthlyBudget>(`${this.resourceUrl}/${this.getMonthlyBudgetIdentifier(monthlyBudget)}`, monthlyBudget, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMonthlyBudget>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMonthlyBudget[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMonthlyBudgetIdentifier(monthlyBudget: Pick<IMonthlyBudget, 'id'>): number {
    return monthlyBudget.id;
  }

  compareMonthlyBudget(o1: Pick<IMonthlyBudget, 'id'> | null, o2: Pick<IMonthlyBudget, 'id'> | null): boolean {
    return o1 && o2 ? this.getMonthlyBudgetIdentifier(o1) === this.getMonthlyBudgetIdentifier(o2) : o1 === o2;
  }

  addMonthlyBudgetToCollectionIfMissing<Type extends Pick<IMonthlyBudget, 'id'>>(
    monthlyBudgetCollection: Type[],
    ...monthlyBudgetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const monthlyBudgets: Type[] = monthlyBudgetsToCheck.filter(isPresent);
    if (monthlyBudgets.length > 0) {
      const monthlyBudgetCollectionIdentifiers = monthlyBudgetCollection.map(
        monthlyBudgetItem => this.getMonthlyBudgetIdentifier(monthlyBudgetItem)!,
      );
      const monthlyBudgetsToAdd = monthlyBudgets.filter(monthlyBudgetItem => {
        const monthlyBudgetIdentifier = this.getMonthlyBudgetIdentifier(monthlyBudgetItem);
        if (monthlyBudgetCollectionIdentifiers.includes(monthlyBudgetIdentifier)) {
          return false;
        }
        monthlyBudgetCollectionIdentifiers.push(monthlyBudgetIdentifier);
        return true;
      });
      return [...monthlyBudgetsToAdd, ...monthlyBudgetCollection];
    }
    return monthlyBudgetCollection;
  }
}
