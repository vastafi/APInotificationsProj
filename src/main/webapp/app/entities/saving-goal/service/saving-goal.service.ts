import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISavingGoal, NewSavingGoal } from '../saving-goal.model';

export type PartialUpdateSavingGoal = Partial<ISavingGoal> & Pick<ISavingGoal, 'id'>;

type RestOf<T extends ISavingGoal | NewSavingGoal> = Omit<T, 'targetDate'> & {
  targetDate?: string | null;
};

export type RestSavingGoal = RestOf<ISavingGoal>;

export type NewRestSavingGoal = RestOf<NewSavingGoal>;

export type PartialUpdateRestSavingGoal = RestOf<PartialUpdateSavingGoal>;

export type EntityResponseType = HttpResponse<ISavingGoal>;
export type EntityArrayResponseType = HttpResponse<ISavingGoal[]>;

@Injectable({ providedIn: 'root' })
export class SavingGoalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/saving-goals');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(savingGoal: NewSavingGoal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(savingGoal);
    return this.http
      .post<RestSavingGoal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(savingGoal: ISavingGoal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(savingGoal);
    return this.http
      .put<RestSavingGoal>(`${this.resourceUrl}/${this.getSavingGoalIdentifier(savingGoal)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(savingGoal: PartialUpdateSavingGoal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(savingGoal);
    return this.http
      .patch<RestSavingGoal>(`${this.resourceUrl}/${this.getSavingGoalIdentifier(savingGoal)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSavingGoal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSavingGoal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSavingGoalIdentifier(savingGoal: Pick<ISavingGoal, 'id'>): number {
    return savingGoal.id;
  }

  compareSavingGoal(o1: Pick<ISavingGoal, 'id'> | null, o2: Pick<ISavingGoal, 'id'> | null): boolean {
    return o1 && o2 ? this.getSavingGoalIdentifier(o1) === this.getSavingGoalIdentifier(o2) : o1 === o2;
  }

  addSavingGoalToCollectionIfMissing<Type extends Pick<ISavingGoal, 'id'>>(
    savingGoalCollection: Type[],
    ...savingGoalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const savingGoals: Type[] = savingGoalsToCheck.filter(isPresent);
    if (savingGoals.length > 0) {
      const savingGoalCollectionIdentifiers = savingGoalCollection.map(savingGoalItem => this.getSavingGoalIdentifier(savingGoalItem)!);
      const savingGoalsToAdd = savingGoals.filter(savingGoalItem => {
        const savingGoalIdentifier = this.getSavingGoalIdentifier(savingGoalItem);
        if (savingGoalCollectionIdentifiers.includes(savingGoalIdentifier)) {
          return false;
        }
        savingGoalCollectionIdentifiers.push(savingGoalIdentifier);
        return true;
      });
      return [...savingGoalsToAdd, ...savingGoalCollection];
    }
    return savingGoalCollection;
  }

  protected convertDateFromClient<T extends ISavingGoal | NewSavingGoal | PartialUpdateSavingGoal>(savingGoal: T): RestOf<T> {
    return {
      ...savingGoal,
      targetDate: savingGoal.targetDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restSavingGoal: RestSavingGoal): ISavingGoal {
    return {
      ...restSavingGoal,
      targetDate: restSavingGoal.targetDate ? dayjs(restSavingGoal.targetDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSavingGoal>): HttpResponse<ISavingGoal> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSavingGoal[]>): HttpResponse<ISavingGoal[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
