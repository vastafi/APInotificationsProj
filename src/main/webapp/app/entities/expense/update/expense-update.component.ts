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
import { ExpenseService } from '../service/expense.service';
import { IExpense } from '../expense.model';
import { ExpenseFormService, ExpenseFormGroup } from './expense-form.service';

@Component({
  standalone: true,
  selector: 'jhi-expense-update',
  templateUrl: './expense-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExpenseUpdateComponent implements OnInit {
  isSaving = false;
  expense: IExpense | null = null;

  usersSharedCollection: IUser[] = [];
  expenseCategoriesSharedCollection: IExpenseCategory[] = [];

  editForm: ExpenseFormGroup = this.expenseFormService.createExpenseFormGroup();

  constructor(
    protected expenseService: ExpenseService,
    protected expenseFormService: ExpenseFormService,
    protected userService: UserService,
    protected expenseCategoryService: ExpenseCategoryService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareExpenseCategory = (o1: IExpenseCategory | null, o2: IExpenseCategory | null): boolean =>
    this.expenseCategoryService.compareExpenseCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ expense }) => {
      this.expense = expense;
      if (expense) {
        this.updateForm(expense);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const expense = this.expenseFormService.getExpense(this.editForm);
    if (expense.id !== null) {
      this.subscribeToSaveResponse(this.expenseService.update(expense));
    } else {
      this.subscribeToSaveResponse(this.expenseService.create(expense));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExpense>>): void {
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

  protected updateForm(expense: IExpense): void {
    this.expense = expense;
    this.expenseFormService.resetForm(this.editForm, expense);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, expense.user);
    this.expenseCategoriesSharedCollection = this.expenseCategoryService.addExpenseCategoryToCollectionIfMissing<IExpenseCategory>(
      this.expenseCategoriesSharedCollection,
      expense.expenseCategory,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.expense?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.expenseCategoryService
      .query()
      .pipe(map((res: HttpResponse<IExpenseCategory[]>) => res.body ?? []))
      .pipe(
        map((expenseCategories: IExpenseCategory[]) =>
          this.expenseCategoryService.addExpenseCategoryToCollectionIfMissing<IExpenseCategory>(
            expenseCategories,
            this.expense?.expenseCategory,
          ),
        ),
      )
      .subscribe((expenseCategories: IExpenseCategory[]) => (this.expenseCategoriesSharedCollection = expenseCategories));
  }
}
