import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISavingGoal } from '../saving-goal.model';
import { SavingGoalService } from '../service/saving-goal.service';
import { SavingGoalFormService, SavingGoalFormGroup } from './saving-goal-form.service';

@Component({
  standalone: true,
  selector: 'jhi-saving-goal-update',
  templateUrl: './saving-goal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SavingGoalUpdateComponent implements OnInit {
  isSaving = false;
  savingGoal: ISavingGoal | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: SavingGoalFormGroup = this.savingGoalFormService.createSavingGoalFormGroup();

  constructor(
    protected savingGoalService: SavingGoalService,
    protected savingGoalFormService: SavingGoalFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ savingGoal }) => {
      this.savingGoal = savingGoal;
      if (savingGoal) {
        this.updateForm(savingGoal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const savingGoal = this.savingGoalFormService.getSavingGoal(this.editForm);
    if (savingGoal.id !== null) {
      this.subscribeToSaveResponse(this.savingGoalService.update(savingGoal));
    } else {
      this.subscribeToSaveResponse(this.savingGoalService.create(savingGoal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISavingGoal>>): void {
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

  protected updateForm(savingGoal: ISavingGoal): void {
    this.savingGoal = savingGoal;
    this.savingGoalFormService.resetForm(this.editForm, savingGoal);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, savingGoal.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.savingGoal?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
