import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExpenseCategoryService } from '../service/expense-category.service';
import { IExpenseCategory } from '../expense-category.model';
import { ExpenseCategoryFormService } from './expense-category-form.service';

import { ExpenseCategoryUpdateComponent } from './expense-category-update.component';

describe('ExpenseCategory Management Update Component', () => {
  let comp: ExpenseCategoryUpdateComponent;
  let fixture: ComponentFixture<ExpenseCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let expenseCategoryFormService: ExpenseCategoryFormService;
  let expenseCategoryService: ExpenseCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExpenseCategoryUpdateComponent],
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
      .overrideTemplate(ExpenseCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExpenseCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    expenseCategoryFormService = TestBed.inject(ExpenseCategoryFormService);
    expenseCategoryService = TestBed.inject(ExpenseCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const expenseCategory: IExpenseCategory = { id: 456 };

      activatedRoute.data = of({ expenseCategory });
      comp.ngOnInit();

      expect(comp.expenseCategory).toEqual(expenseCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenseCategory>>();
      const expenseCategory = { id: 123 };
      jest.spyOn(expenseCategoryFormService, 'getExpenseCategory').mockReturnValue(expenseCategory);
      jest.spyOn(expenseCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenseCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expenseCategory }));
      saveSubject.complete();

      // THEN
      expect(expenseCategoryFormService.getExpenseCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(expenseCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(expenseCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenseCategory>>();
      const expenseCategory = { id: 123 };
      jest.spyOn(expenseCategoryFormService, 'getExpenseCategory').mockReturnValue({ id: null });
      jest.spyOn(expenseCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenseCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expenseCategory }));
      saveSubject.complete();

      // THEN
      expect(expenseCategoryFormService.getExpenseCategory).toHaveBeenCalled();
      expect(expenseCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenseCategory>>();
      const expenseCategory = { id: 123 };
      jest.spyOn(expenseCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenseCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(expenseCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
