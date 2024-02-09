package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ExpenseCategoryTestSamples.*;
import static com.mycompany.myapp.domain.MonthlyBudgetTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MonthlyBudgetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MonthlyBudget.class);
        MonthlyBudget monthlyBudget1 = getMonthlyBudgetSample1();
        MonthlyBudget monthlyBudget2 = new MonthlyBudget();
        assertThat(monthlyBudget1).isNotEqualTo(monthlyBudget2);

        monthlyBudget2.setId(monthlyBudget1.getId());
        assertThat(monthlyBudget1).isEqualTo(monthlyBudget2);

        monthlyBudget2 = getMonthlyBudgetSample2();
        assertThat(monthlyBudget1).isNotEqualTo(monthlyBudget2);
    }

    @Test
    void expenseCategoryTest() throws Exception {
        MonthlyBudget monthlyBudget = getMonthlyBudgetRandomSampleGenerator();
        ExpenseCategory expenseCategoryBack = getExpenseCategoryRandomSampleGenerator();

        monthlyBudget.setExpenseCategory(expenseCategoryBack);
        assertThat(monthlyBudget.getExpenseCategory()).isEqualTo(expenseCategoryBack);

        monthlyBudget.expenseCategory(null);
        assertThat(monthlyBudget.getExpenseCategory()).isNull();
    }
}
