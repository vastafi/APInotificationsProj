import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMonthlyBudget } from '../monthly-budget.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../monthly-budget.test-samples';

import { MonthlyBudgetService } from './monthly-budget.service';

const requireRestSample: IMonthlyBudget = {
  ...sampleWithRequiredData,
};

describe('MonthlyBudget Service', () => {
  let service: MonthlyBudgetService;
  let httpMock: HttpTestingController;
  let expectedResult: IMonthlyBudget | IMonthlyBudget[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MonthlyBudgetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a MonthlyBudget', () => {
      const monthlyBudget = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(monthlyBudget).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MonthlyBudget', () => {
      const monthlyBudget = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(monthlyBudget).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MonthlyBudget', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MonthlyBudget', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MonthlyBudget', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMonthlyBudgetToCollectionIfMissing', () => {
      it('should add a MonthlyBudget to an empty array', () => {
        const monthlyBudget: IMonthlyBudget = sampleWithRequiredData;
        expectedResult = service.addMonthlyBudgetToCollectionIfMissing([], monthlyBudget);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(monthlyBudget);
      });

      it('should not add a MonthlyBudget to an array that contains it', () => {
        const monthlyBudget: IMonthlyBudget = sampleWithRequiredData;
        const monthlyBudgetCollection: IMonthlyBudget[] = [
          {
            ...monthlyBudget,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMonthlyBudgetToCollectionIfMissing(monthlyBudgetCollection, monthlyBudget);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MonthlyBudget to an array that doesn't contain it", () => {
        const monthlyBudget: IMonthlyBudget = sampleWithRequiredData;
        const monthlyBudgetCollection: IMonthlyBudget[] = [sampleWithPartialData];
        expectedResult = service.addMonthlyBudgetToCollectionIfMissing(monthlyBudgetCollection, monthlyBudget);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(monthlyBudget);
      });

      it('should add only unique MonthlyBudget to an array', () => {
        const monthlyBudgetArray: IMonthlyBudget[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const monthlyBudgetCollection: IMonthlyBudget[] = [sampleWithRequiredData];
        expectedResult = service.addMonthlyBudgetToCollectionIfMissing(monthlyBudgetCollection, ...monthlyBudgetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const monthlyBudget: IMonthlyBudget = sampleWithRequiredData;
        const monthlyBudget2: IMonthlyBudget = sampleWithPartialData;
        expectedResult = service.addMonthlyBudgetToCollectionIfMissing([], monthlyBudget, monthlyBudget2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(monthlyBudget);
        expect(expectedResult).toContain(monthlyBudget2);
      });

      it('should accept null and undefined values', () => {
        const monthlyBudget: IMonthlyBudget = sampleWithRequiredData;
        expectedResult = service.addMonthlyBudgetToCollectionIfMissing([], null, monthlyBudget, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(monthlyBudget);
      });

      it('should return initial array if no MonthlyBudget is added', () => {
        const monthlyBudgetCollection: IMonthlyBudget[] = [sampleWithRequiredData];
        expectedResult = service.addMonthlyBudgetToCollectionIfMissing(monthlyBudgetCollection, undefined, null);
        expect(expectedResult).toEqual(monthlyBudgetCollection);
      });
    });

    describe('compareMonthlyBudget', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMonthlyBudget(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMonthlyBudget(entity1, entity2);
        const compareResult2 = service.compareMonthlyBudget(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMonthlyBudget(entity1, entity2);
        const compareResult2 = service.compareMonthlyBudget(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMonthlyBudget(entity1, entity2);
        const compareResult2 = service.compareMonthlyBudget(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
