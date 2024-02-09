import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IExpenseCategory } from 'app/entities/expense-category/expense-category.model';
import { ExpenseCategoryService } from 'app/entities/expense-category/service/expense-category.service';
import { MonthlyBudgetService } from '../service/monthly-budget.service';
import { IMonthlyBudget } from '../monthly-budget.model';
import { MonthlyBudgetFormService, MonthlyBudgetFormGroup } from './monthly-budget-form.service';

@Component({
  standalone: true,
  selector: 'jhi-monthly-budget-update',
  templateUrl: './monthly-budget-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MonthlyBudgetUpdateComponent implements OnInit {
  isSaving = false;
  monthlyBudget: IMonthlyBudget | null = null;

  usersSharedCollection: IUser[] = [];
  expenseCategoriesSharedCollection: IExpenseCategory[] = [];

  editForm: MonthlyBudgetFormGroup = this.monthlyBudgetFormService.createMonthlyBudgetFormGroup();

  constructor(
    protected monthlyBudgetService: MonthlyBudgetService,
    protected monthlyBudgetFormService: MonthlyBudgetFormService,
    protected userService: UserService,
    protected expenseCategoryService: ExpenseCategoryService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareExpenseCategory = (o1: IExpenseCategory | null, o2: IExpenseCategory | null): boolean =>
    this.expenseCategoryService.compareExpenseCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ monthlyBudget }) => {
      this.monthlyBudget = monthlyBudget;
      if (monthlyBudget) {
        this.updateForm(monthlyBudget);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const monthlyBudget = this.monthlyBudgetFormService.getMonthlyBudget(this.editForm);
    if (monthlyBudget.id !== null) {
      this.subscribeToSaveResponse(this.monthlyBudgetService.update(monthlyBudget));
    } else {
      this.subscribeToSaveResponse(this.monthlyBudgetService.create(monthlyBudget));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMonthlyBudget>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(monthlyBudget: IMonthlyBudget): void {
    this.monthlyBudget = monthlyBudget;
    this.monthlyBudgetFormService.resetForm(this.editForm, monthlyBudget);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, monthlyBudget.user);
    this.expenseCategoriesSharedCollection = this.expenseCategoryService.addExpenseCategoryToCollectionIfMissing<IExpenseCategory>(
      this.expenseCategoriesSharedCollection,
      monthlyBudget.expenseCategory,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.monthlyBudget?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.expenseCategoryService
      .query()
      .pipe(map((res: HttpResponse<IExpenseCategory[]>) => res.body ?? []))
      .pipe(
        map((expenseCategories: IExpenseCategory[]) =>
          this.expenseCategoryService.addExpenseCategoryToCollectionIfMissing<IExpenseCategory>(
            expenseCategories,
            this.monthlyBudget?.expenseCategory,
          ),
        ),
      )
      .subscribe((expenseCategories: IExpenseCategory[]) => (this.expenseCategoriesSharedCollection = expenseCategories));
  }
}
