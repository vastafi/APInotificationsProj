import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISavingGoal } from '../saving-goal.model';
import { SavingGoalService } from '../service/saving-goal.service';

@Component({
  standalone: true,
  templateUrl: './saving-goal-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SavingGoalDeleteDialogComponent {
  savingGoal?: ISavingGoal;

  constructor(
    protected savingGoalService: SavingGoalService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.savingGoalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
