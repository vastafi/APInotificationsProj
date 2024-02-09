import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IExpense } from '../expense.model';
import { ExpenseService } from '../service/expense.service';

@Component({
  standalone: true,
  templateUrl: './expense-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExpenseDeleteDialogComponent {
  expense?: IExpense;

  constructor(
    protected expenseService: ExpenseService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.expenseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
