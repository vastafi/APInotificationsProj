import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IExpenseCategory } from 'app/entities/expense-category/expense-category.model';
import { ExpenseCategoryService } from 'app/entities/expense-category/service/expense-category.service';
import { IMonthlyBudget } from '../monthly-budget.model';
import { MonthlyBudgetService } from '../service/monthly-budget.service';
import { MonthlyBudgetFormService } from './monthly-budget-form.service';

import { MonthlyBudgetUpdateComponent } from './monthly-budget-update.component';

describe('MonthlyBudget Management Update Component', () => {
  let comp: MonthlyBudgetUpdateComponent;
  let fixture: ComponentFixture<MonthlyBudgetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let monthlyBudgetFormService: MonthlyBudgetFormService;
  let monthlyBudgetService: MonthlyBudgetService;
  let userService: UserService;
  let expenseCategoryService: ExpenseCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MonthlyBudgetUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MonthlyBudgetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MonthlyBudgetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    monthlyBudgetFormService = TestBed.inject(MonthlyBudgetFormService);
    monthlyBudgetService = TestBed.inject(MonthlyBudgetService);
    userService = TestBed.inject(UserService);
    expenseCategoryService = TestBed.inject(ExpenseCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const monthlyBudget: IMonthlyBudget = { id: 456 };
      const user: IUser = { id: 8287 };
      monthlyBudget.user = user;

      const userCollection: IUser[] = [{ id: 13385 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ monthlyBudget });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ExpenseCategory query and add missing value', () => {
      const monthlyBudget: IMonthlyBudget = { id: 456 };
      const expenseCategory: IExpenseCategory = { id: 15140 };
      monthlyBudget.expenseCategory = expenseCategory;

      const expenseCategoryCollection: IExpenseCategory[] = [{ id: 16260 }];
      jest.spyOn(expenseCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: expenseCategoryCollection })));
      const additionalExpenseCategories = [expenseCategory];
      const expectedCollection: IExpenseCategory[] = [...additionalExpenseCategories, ...expenseCategoryCollection];
      jest.spyOn(expenseCategoryService, 'addExpenseCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ monthlyBudget });
      comp.ngOnInit();

      expect(expenseCategoryService.query).toHaveBeenCalled();
      expect(expenseCategoryService.addExpenseCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        expenseCategoryCollection,
        ...additionalExpenseCategories.map(expect.objectContaining),
      );
      expect(comp.expenseCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const monthlyBudget: IMonthlyBudget = { id: 456 };
      const user: IUser = { id: 7903 };
      monthlyBudget.user = user;
      const expenseCategory: IExpenseCategory = { id: 6826 };
      monthlyBudget.expenseCategory = expenseCategory;

      activatedRoute.data = of({ monthlyBudget });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.expenseCategoriesSharedCollection).toContain(expenseCategory);
      expect(comp.monthlyBudget).toEqual(monthlyBudget);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMonthlyBudget>>();
      const monthlyBudget = { id: 123 };
      jest.spyOn(monthlyBudgetFormService, 'getMonthlyBudget').mockReturnValue(monthlyBudget);
      jest.spyOn(monthlyBudgetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyBudget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: monthlyBudget }));
      saveSubject.complete();

      // THEN
      expect(monthlyBudgetFormService.getMonthlyBudget).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(monthlyBudgetService.update).toHaveBeenCalledWith(expect.objectContaining(monthlyBudget));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMonthlyBudget>>();
      const monthlyBudget = { id: 123 };
      jest.spyOn(monthlyBudgetFormService, 'getMonthlyBudget').mockReturnValue({ id: null });
      jest.spyOn(monthlyBudgetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyBudget: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: monthlyBudget }));
      saveSubject.complete();

      // THEN
      expect(monthlyBudgetFormService.getMonthlyBudget).toHaveBeenCalled();
      expect(monthlyBudgetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMonthlyBudget>>();
      const monthlyBudget = { id: 123 };
      jest.spyOn(monthlyBudgetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ monthlyBudget });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(monthlyBudgetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareExpenseCategory', () => {
      it('Should forward to expenseCategoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(expenseCategoryService, 'compareExpenseCategory');
        comp.compareExpenseCategory(entity, entity2);
        expect(expenseCategoryService.compareExpenseCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
