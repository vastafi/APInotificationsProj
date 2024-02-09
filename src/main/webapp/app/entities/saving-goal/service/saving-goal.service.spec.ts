import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISavingGoal } from '../saving-goal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../saving-goal.test-samples';

import { SavingGoalService, RestSavingGoal } from './saving-goal.service';

const requireRestSample: RestSavingGoal = {
  ...sampleWithRequiredData,
  targetDate: sampleWithRequiredData.targetDate?.format(DATE_FORMAT),
};

describe('SavingGoal Service', () => {
  let service: SavingGoalService;
  let httpMock: HttpTestingController;
  let expectedResult: ISavingGoal | ISavingGoal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SavingGoalService);
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

    it('should create a SavingGoal', () => {
      const savingGoal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(savingGoal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SavingGoal', () => {
      const savingGoal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(savingGoal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SavingGoal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SavingGoal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SavingGoal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSavingGoalToCollectionIfMissing', () => {
      it('should add a SavingGoal to an empty array', () => {
        const savingGoal: ISavingGoal = sampleWithRequiredData;
        expectedResult = service.addSavingGoalToCollectionIfMissing([], savingGoal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(savingGoal);
      });

      it('should not add a SavingGoal to an array that contains it', () => {
        const savingGoal: ISavingGoal = sampleWithRequiredData;
        const savingGoalCollection: ISavingGoal[] = [
          {
            ...savingGoal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSavingGoalToCollectionIfMissing(savingGoalCollection, savingGoal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SavingGoal to an array that doesn't contain it", () => {
        const savingGoal: ISavingGoal = sampleWithRequiredData;
        const savingGoalCollection: ISavingGoal[] = [sampleWithPartialData];
        expectedResult = service.addSavingGoalToCollectionIfMissing(savingGoalCollection, savingGoal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(savingGoal);
      });

      it('should add only unique SavingGoal to an array', () => {
        const savingGoalArray: ISavingGoal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const savingGoalCollection: ISavingGoal[] = [sampleWithRequiredData];
        expectedResult = service.addSavingGoalToCollectionIfMissing(savingGoalCollection, ...savingGoalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const savingGoal: ISavingGoal = sampleWithRequiredData;
        const savingGoal2: ISavingGoal = sampleWithPartialData;
        expectedResult = service.addSavingGoalToCollectionIfMissing([], savingGoal, savingGoal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(savingGoal);
        expect(expectedResult).toContain(savingGoal2);
      });

      it('should accept null and undefined values', () => {
        const savingGoal: ISavingGoal = sampleWithRequiredData;
        expectedResult = service.addSavingGoalToCollectionIfMissing([], null, savingGoal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(savingGoal);
      });

      it('should return initial array if no SavingGoal is added', () => {
        const savingGoalCollection: ISavingGoal[] = [sampleWithRequiredData];
        expectedResult = service.addSavingGoalToCollectionIfMissing(savingGoalCollection, undefined, null);
        expect(expectedResult).toEqual(savingGoalCollection);
      });
    });

    describe('compareSavingGoal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSavingGoal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSavingGoal(entity1, entity2);
        const compareResult2 = service.compareSavingGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSavingGoal(entity1, entity2);
        const compareResult2 = service.compareSavingGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSavingGoal(entity1, entity2);
        const compareResult2 = service.compareSavingGoal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
