package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class SavingGoalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static SavingGoal getSavingGoalSample1() {
        return new SavingGoal().id(1L);
    }

    public static SavingGoal getSavingGoalSample2() {
        return new SavingGoal().id(2L);
    }

    public static SavingGoal getSavingGoalRandomSampleGenerator() {
        return new SavingGoal().id(longCount.incrementAndGet());
    }
}
