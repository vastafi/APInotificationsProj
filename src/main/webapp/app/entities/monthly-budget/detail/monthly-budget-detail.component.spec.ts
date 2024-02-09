import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MonthlyBudgetDetailComponent } from './monthly-budget-detail.component';

describe('MonthlyBudget Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyBudgetDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MonthlyBudgetDetailComponent,
              resolve: { monthlyBudget: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MonthlyBudgetDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load monthlyBudget on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MonthlyBudgetDetailComponent);

      // THEN
      expect(instance.monthlyBudget).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
