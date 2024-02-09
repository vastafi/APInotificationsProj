import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IExpenseCategory } from '../expense-category.model';
import { ExpenseCategoryService } from '../service/expense-category.service';
import { ExpenseCategoryFormService, ExpenseCategoryFormGroup } from './expense-category-form.service';

@Component({
  standalone: true,
  selector: 'jhi-expense-category-update',
  templateUrl: './expense-category-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExpenseCategoryUpdateComponent implements OnInit {
  isSaving = false;
  expenseCategory: IExpenseCategory | null = null;

  editForm: ExpenseCategoryFormGroup = this.expenseCategoryFormService.createExpenseCategoryFormGroup();

  constructor(
    protected expenseCategoryService: ExpenseCategoryService,
    protected expenseCategoryFormService: ExpenseCategoryFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ expenseCategory }) => {
      this.expenseCategory = expenseCategory;
      if (expenseCategory) {
        this.updateForm(expenseCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const expenseCategory = this.expenseCategoryFormService.getExpenseCategory(this.editForm);
    if (expenseCategory.id !== null) {
      this.subscribeToSaveResponse(this.expenseCategoryService.update(expenseCategory));
    } else {
      this.subscribeToSaveResponse(this.expenseCategoryService.create(expenseCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExpenseCategory>>): void {
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

  protected updateForm(expenseCategory: IExpenseCategory): void {
    this.expenseCategory = expenseCategory;
    this.expenseCategoryFormService.resetForm(this.editForm, expenseCategory);
  }
}
