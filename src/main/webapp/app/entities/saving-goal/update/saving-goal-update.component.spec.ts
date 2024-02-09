import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { SavingGoalService } from '../service/saving-goal.service';
import { ISavingGoal } from '../saving-goal.model';

import { SavingGoalFormService } from './saving-goal-form.service';

import { SavingGoalUpdateComponent } from './saving-goal-update.component';

describe('SavingGoal Management Update Component', () => {
  let comp: SavingGoalUpdateComponent;
  let fixture: ComponentFixture<SavingGoalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let savingGoalFormService: SavingGoalFormService;
  let savingGoalService: SavingGoalService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SavingGoalUpdateComponent],
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
      .overrideTemplate(SavingGoalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SavingGoalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    savingGoalFormService = TestBed.inject(SavingGoalFormService);
    savingGoalService = TestBed.inject(SavingGoalService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const savingGoal: ISavingGoal = { id: 456 };
      const user: IUser = { id: 15428 };
      savingGoal.user = user;

      const userCollection: IUser[] = [{ id: 16489 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ savingGoal });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const savingGoal: ISavingGoal = { id: 456 };
      const user: IUser = { id: 29232 };
      savingGoal.user = user;

      activatedRoute.data = of({ savingGoal });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.savingGoal).toEqual(savingGoal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISavingGoal>>();
      const savingGoal = { id: 123 };
      jest.spyOn(savingGoalFormService, 'getSavingGoal').mockReturnValue(savingGoal);
      jest.spyOn(savingGoalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ savingGoal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: savingGoal }));
      saveSubject.complete();

      // THEN
      expect(savingGoalFormService.getSavingGoal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(savingGoalService.update).toHaveBeenCalledWith(expect.objectContaining(savingGoal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISavingGoal>>();
      const savingGoal = { id: 123 };
      jest.spyOn(savingGoalFormService, 'getSavingGoal').mockReturnValue({ id: null });
      jest.spyOn(savingGoalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ savingGoal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: savingGoal }));
      saveSubject.complete();

      // THEN
      expect(savingGoalFormService.getSavingGoal).toHaveBeenCalled();
      expect(savingGoalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISavingGoal>>();
      const savingGoal = { id: 123 };
      jest.spyOn(savingGoalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ savingGoal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(savingGoalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
