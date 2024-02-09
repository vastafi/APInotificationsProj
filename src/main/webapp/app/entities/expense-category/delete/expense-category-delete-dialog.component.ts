import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IExpenseCategory } from '../expense-category.model';
import { ExpenseCategoryService } from '../service/expense-category.service';

@Component({
  standalone: true,
  templateUrl: './expense-category-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExpenseCategoryDeleteDialogComponent {
  expenseCategory?: IExpenseCategory;

  constructor(
    protected expenseCategoryService: ExpenseCategoryService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.expenseCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
