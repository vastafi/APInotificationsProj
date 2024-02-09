import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExpenseCategoryDetailComponent } from './expense-category-detail.component';

describe('ExpenseCategory Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCategoryDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ExpenseCategoryDetailComponent,
              resolve: { expenseCategory: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ExpenseCategoryDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load expenseCategory on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ExpenseCategoryDetailComponent);

      // THEN
      expect(instance.expenseCategory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
