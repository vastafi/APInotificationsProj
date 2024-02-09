import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'report',
    data: { pageTitle: 'notificationsProjApp.report.home.title' },
    loadChildren: () => import('./report/report.routes'),
  },
  {
    path: 'notification',
    data: { pageTitle: 'notificationsProjApp.notification.home.title' },
    loadChildren: () => import('./notification/notification.routes'),
  },
  {
    path: 'monthly-budget',
    data: { pageTitle: 'notificationsProjApp.monthlyBudget.home.title' },
    loadChildren: () => import('./monthly-budget/monthly-budget.routes'),
  },
  {
    path: 'saving-goal',
    data: { pageTitle: 'notificationsProjApp.savingGoal.home.title' },
    loadChildren: () => import('./saving-goal/saving-goal.routes'),
  },
  {
    path: 'expense-category',
    data: { pageTitle: 'notificationsProjApp.expenseCategory.home.title' },
    loadChildren: () => import('./expense-category/expense-category.routes'),
  },
  {
    path: 'expense',
    data: { pageTitle: 'notificationsProjApp.expense.home.title' },
    loadChildren: () => import('./expense/expense.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
