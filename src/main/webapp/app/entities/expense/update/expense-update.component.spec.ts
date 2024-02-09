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
import { IExpense } from '../expense.model';
import { ExpenseService } from '../service/expense.service';
import { ExpenseFormService } from './expense-form.service';

import { ExpenseUpdateComponent } from './expense-update.component';

describe('Expense Management Update Component', () => {
  let comp: ExpenseUpdateComponent;
  let fixture: ComponentFixture<ExpenseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let expenseFormService: ExpenseFormService;
  let expenseService: ExpenseService;
  let userService: UserService;
  let expenseCategoryService: ExpenseCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExpenseUpdateComponent],
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
      .overrideTemplate(ExpenseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExpenseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    expenseFormService = TestBed.inject(ExpenseFormService);
    expenseService = TestBed.inject(ExpenseService);
    userService = TestBed.inject(UserService);
    expenseCategoryService = TestBed.inject(ExpenseCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const expense: IExpense = { id: 456 };
      const user: IUser = { id: 28038 };
      expense.user = user;

      const userCollection: IUser[] = [{ id: 28657 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ expense });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ExpenseCategory query and add missing value', () => {
      const expense: IExpense = { id: 456 };
      const expenseCategory: IExpenseCategory = { id: 32493 };
      expense.expenseCategory = expenseCategory;

      const expenseCategoryCollection: IExpenseCategory[] = [{ id: 29084 }];
      jest.spyOn(expenseCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: expenseCategoryCollection })));
      const additionalExpenseCategories = [expenseCategory];
      const expectedCollection: IExpenseCategory[] = [...additionalExpenseCategories, ...expenseCategoryCollection];
      jest.spyOn(expenseCategoryService, 'addExpenseCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ expense });
      comp.ngOnInit();

      expect(expenseCategoryService.query).toHaveBeenCalled();
      expect(expenseCategoryService.addExpenseCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        expenseCategoryCollection,
        ...additionalExpenseCategories.map(expect.objectContaining),
      );
      expect(comp.expenseCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const expense: IExpense = { id: 456 };
      const user: IUser = { id: 16932 };
      expense.user = user;
      const expenseCategory: IExpenseCategory = { id: 9014 };
      expense.expenseCategory = expenseCategory;

      activatedRoute.data = of({ expense });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.expenseCategoriesSharedCollection).toContain(expenseCategory);
      expect(comp.expense).toEqual(expense);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpense>>();
      const expense = { id: 123 };
      jest.spyOn(expenseFormService, 'getExpense').mockReturnValue(expense);
      jest.spyOn(expenseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expense });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expense }));
      saveSubject.complete();

      // THEN
      expect(expenseFormService.getExpense).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(expenseService.update).toHaveBeenCalledWith(expect.objectContaining(expense));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpense>>();
      const expense = { id: 123 };
      jest.spyOn(expenseFormService, 'getExpense').mockReturnValue({ id: null });
      jest.spyOn(expenseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expense: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expense }));
      saveSubject.complete();

      // THEN
      expect(expenseFormService.getExpense).toHaveBeenCalled();
      expect(expenseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpense>>();
      const expense = { id: 123 };
      jest.spyOn(expenseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expense });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(expenseService.update).toHaveBeenCalled();
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
