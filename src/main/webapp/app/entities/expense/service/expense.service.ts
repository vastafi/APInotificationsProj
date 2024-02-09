import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExpense, NewExpense } from '../expense.model';

export type PartialUpdateExpense = Partial<IExpense> & Pick<IExpense, 'id'>;

type RestOf<T extends IExpense | NewExpense> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestExpense = RestOf<IExpense>;

export type NewRestExpense = RestOf<NewExpense>;

export type PartialUpdateRestExpense = RestOf<PartialUpdateExpense>;

export type EntityResponseType = HttpResponse<IExpense>;
export type EntityArrayResponseType = HttpResponse<IExpense[]>;

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/expenses');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(expense: NewExpense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expense);
    return this.http
      .post<RestExpense>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(expense: IExpense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expense);
    return this.http
      .put<RestExpense>(`${this.resourceUrl}/${this.getExpenseIdentifier(expense)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(expense: PartialUpdateExpense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expense);
    return this.http
      .patch<RestExpense>(`${this.resourceUrl}/${this.getExpenseIdentifier(expense)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestExpense>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExpense[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExpenseIdentifier(expense: Pick<IExpense, 'id'>): number {
    return expense.id;
  }

  compareExpense(o1: Pick<IExpense, 'id'> | null, o2: Pick<IExpense, 'id'> | null): boolean {
    return o1 && o2 ? this.getExpenseIdentifier(o1) === this.getExpenseIdentifier(o2) : o1 === o2;
  }

  addExpenseToCollectionIfMissing<Type extends Pick<IExpense, 'id'>>(
    expenseCollection: Type[],
    ...expensesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const expenses: Type[] = expensesToCheck.filter(isPresent);
    if (expenses.length > 0) {
      const expenseCollectionIdentifiers = expenseCollection.map(expenseItem => this.getExpenseIdentifier(expenseItem)!);
      const expensesToAdd = expenses.filter(expenseItem => {
        const expenseIdentifier = this.getExpenseIdentifier(expenseItem);
        if (expenseCollectionIdentifiers.includes(expenseIdentifier)) {
          return false;
        }
        expenseCollectionIdentifiers.push(expenseIdentifier);
        return true;
      });
      return [...expensesToAdd, ...expenseCollection];
    }
    return expenseCollection;
  }

  protected convertDateFromClient<T extends IExpense | NewExpense | PartialUpdateExpense>(expense: T): RestOf<T> {
    return {
      ...expense,
      date: expense.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restExpense: RestExpense): IExpense {
    return {
      ...restExpense,
      date: restExpense.date ? dayjs(restExpense.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExpense>): HttpResponse<IExpense> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExpense[]>): HttpResponse<IExpense[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
