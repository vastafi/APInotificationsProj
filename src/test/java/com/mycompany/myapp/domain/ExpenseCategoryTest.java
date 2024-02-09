package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ExpenseCategoryTestSamples.*;
import static com.mycompany.myapp.domain.ExpenseTestSamples.*;
import static com.mycompany.myapp.domain.MonthlyBudgetTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ExpenseCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExpenseCategory.class);
        ExpenseCategory expenseCategory1 = getExpenseCategorySample1();
        ExpenseCategory expenseCategory2 = new ExpenseCategory();
        assertThat(expenseCategory1).isNotEqualTo(expenseCategory2);

        expenseCategory2.setId(expenseCategory1.getId());
        assertThat(expenseCategory1).isEqualTo(expenseCategory2);

        expenseCategory2 = getExpenseCategorySample2();
        assertThat(expenseCategory1).isNotEqualTo(expenseCategory2);
    }

    @Test
    void monthlyBudgetTest() throws Exception {
        ExpenseCategory expenseCategory = getExpenseCategoryRandomSampleGenerator();
        MonthlyBudget monthlyBudgetBack = getMonthlyBudgetRandomSampleGenerator();

        expenseCategory.addMonthlyBudget(monthlyBudgetBack);
        assertThat(expenseCategory.getMonthlyBudgets()).containsOnly(monthlyBudgetBack);
        assertThat(monthlyBudgetBack.getExpenseCategory()).isEqualTo(expenseCategory);

        expenseCategory.removeMonthlyBudget(monthlyBudgetBack);
        assertThat(expenseCategory.getMonthlyBudgets()).doesNotContain(monthlyBudgetBack);
        assertThat(monthlyBudgetBack.getExpenseCategory()).isNull();

        expenseCategory.monthlyBudgets(new HashSet<>(Set.of(monthlyBudgetBack)));
        assertThat(expenseCategory.getMonthlyBudgets()).containsOnly(monthlyBudgetBack);
        assertThat(monthlyBudgetBack.getExpenseCategory()).isEqualTo(expenseCategory);

        expenseCategory.setMonthlyBudgets(new HashSet<>());
        assertThat(expenseCategory.getMonthlyBudgets()).doesNotContain(monthlyBudgetBack);
        assertThat(monthlyBudgetBack.getExpenseCategory()).isNull();
    }

    @Test
    void expenseTest() throws Exception {
        ExpenseCategory expenseCategory = getExpenseCategoryRandomSampleGenerator();
        Expense expenseBack = getExpenseRandomSampleGenerator();

        expenseCategory.addExpense(expenseBack);
        assertThat(expenseCategory.getExpenses()).containsOnly(expenseBack);
        assertThat(expenseBack.getExpenseCategory()).isEqualTo(expenseCategory);

        expenseCategory.removeExpense(expenseBack);
        assertThat(expenseCategory.getExpenses()).doesNotContain(expenseBack);
        assertThat(expenseBack.getExpenseCategory()).isNull();

        expenseCategory.expenses(new HashSet<>(Set.of(expenseBack)));
        assertThat(expenseCategory.getExpenses()).containsOnly(expenseBack);
        assertThat(expenseBack.getExpenseCategory()).isEqualTo(expenseCategory);

        expenseCategory.setExpenses(new HashSet<>());
        assertThat(expenseCategory.getExpenses()).doesNotContain(expenseBack);
        assertThat(expenseBack.getExpenseCategory()).isNull();
    }
}
