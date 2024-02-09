import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SavingGoalDetailComponent } from './saving-goal-detail.component';

describe('SavingGoal Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingGoalDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SavingGoalDetailComponent,
              resolve: { savingGoal: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SavingGoalDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load savingGoal on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SavingGoalDetailComponent);

      // THEN
      expect(instance.savingGoal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
