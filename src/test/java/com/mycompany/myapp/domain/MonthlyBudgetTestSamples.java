package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class MonthlyBudgetTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static MonthlyBudget getMonthlyBudgetSample1() {
        return new MonthlyBudget().id(1L);
    }

    public static MonthlyBudget getMonthlyBudgetSample2() {
        return new MonthlyBudget().id(2L);
    }

    public static MonthlyBudget getMonthlyBudgetRandomSampleGenerator() {
        return new MonthlyBudget().id(longCount.incrementAndGet());
    }
}
