import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExpenseDetailComponent } from './expense-detail.component';

describe('Expense Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExpenseDetailComponent,
              resolve: { expense: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExpenseDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load expense on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExpenseDetailComponent);

      // THEN
      expect(instance.expense).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
