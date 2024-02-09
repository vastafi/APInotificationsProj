package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A ExpenseCategory.
 */
@Entity
@Table(name = "expense_category")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExpenseCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "expenseCategory")
    @JsonIgnoreProperties(value = { "user", "expenseCategory" }, allowSetters = true)
    private Set<MonthlyBudget> monthlyBudgets = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "expenseCategory")
    @JsonIgnoreProperties(value = { "user", "expenseCategory" }, allowSetters = true)
    private Set<Expense> expenses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExpenseCategory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ExpenseCategory name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<MonthlyBudget> getMonthlyBudgets() {
        return this.monthlyBudgets;
    }

    public void setMonthlyBudgets(Set<MonthlyBudget> monthlyBudgets) {
        if (this.monthlyBudgets != null) {
            this.monthlyBudgets.forEach(i -> i.setExpenseCategory(null));
        }
        if (monthlyBudgets != null) {
            monthlyBudgets.forEach(i -> i.setExpenseCategory(this));
        }
        this.monthlyBudgets = monthlyBudgets;
    }

    public ExpenseCategory monthlyBudgets(Set<MonthlyBudget> monthlyBudgets) {
        this.setMonthlyBudgets(monthlyBudgets);
        return this;
    }

    public ExpenseCategory addMonthlyBudget(MonthlyBudget monthlyBudget) {
        this.monthlyBudgets.add(monthlyBudget);
        monthlyBudget.setExpenseCategory(this);
        return this;
    }

    public ExpenseCategory removeMonthlyBudget(MonthlyBudget monthlyBudget) {
        this.monthlyBudgets.remove(monthlyBudget);
        monthlyBudget.setExpenseCategory(null);
        return this;
    }

    public Set<Expense> getExpenses() {
        return this.expenses;
    }

    public void setExpenses(Set<Expense> expenses) {
        if (this.expenses != null) {
            this.expenses.forEach(i -> i.setExpenseCategory(null));
        }
        if (expenses != null) {
            expenses.forEach(i -> i.setExpenseCategory(this));
        }
        this.expenses = expenses;
    }

    public ExpenseCategory expenses(Set<Expense> expenses) {
        this.setExpenses(expenses);
        return this;
    }

    public ExpenseCategory addExpense(Expense expense) {
        this.expenses.add(expense);
        expense.setExpenseCategory(this);
        return this;
    }

    public ExpenseCategory removeExpense(Expense expense) {
        this.expenses.remove(expense);
        expense.setExpenseCategory(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExpenseCategory)) {
            return false;
        }
        return getId() != null && getId().equals(((ExpenseCategory) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExpenseCategory{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
