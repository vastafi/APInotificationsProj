jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SavingGoalService } from '../service/saving-goal.service';

import { SavingGoalDeleteDialogComponent } from './saving-goal-delete-dialog.component';

describe('SavingGoal Management Delete Component', () => {
  let comp: SavingGoalDeleteDialogComponent;
  let fixture: ComponentFixture<SavingGoalDeleteDialogComponent>;
  let service: SavingGoalService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SavingGoalDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(SavingGoalDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SavingGoalDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SavingGoalService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
