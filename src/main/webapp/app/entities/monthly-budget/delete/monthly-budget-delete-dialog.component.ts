import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMonthlyBudget } from '../monthly-budget.model';
import { MonthlyBudgetService } from '../service/monthly-budget.service';

@Component({
  standalone: true,
  templateUrl: './monthly-budget-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MonthlyBudgetDeleteDialogComponent {
  monthlyBudget?: IMonthlyBudget;

  constructor(
    protected monthlyBudgetService: MonthlyBudgetService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.monthlyBudgetService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
