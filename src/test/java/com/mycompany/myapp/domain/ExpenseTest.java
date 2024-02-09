package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ExpenseCategoryTestSamples.*;
import static com.mycompany.myapp.domain.ExpenseTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExpenseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Expense.class);
        Expense expense1 = getExpenseSample1();
        Expense expense2 = new Expense();
        assertThat(expense1).isNotEqualTo(expense2);

        expense2.setId(expense1.getId());
        assertThat(expense1).isEqualTo(expense2);

        expense2 = getExpenseSample2();
        assertThat(expense1).isNotEqualTo(expense2);
    }

    @Test
    void expenseCategoryTest() throws Exception {
        Expense expense = getExpenseRandomSampleGenerator();
        ExpenseCategory expenseCategoryBack = getExpenseCategoryRandomSampleGenerator();

        expense.setExpenseCategory(expenseCategoryBack);
        assertThat(expense.getExpenseCategory()).isEqualTo(expenseCategoryBack);

        expense.expenseCategory(null);
        assertThat(expense.getExpenseCategory()).isNull();
    }
}
