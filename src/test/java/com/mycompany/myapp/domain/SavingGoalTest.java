package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.SavingGoalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SavingGoalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SavingGoal.class);
        SavingGoal savingGoal1 = getSavingGoalSample1();
        SavingGoal savingGoal2 = new SavingGoal();
        assertThat(savingGoal1).isNotEqualTo(savingGoal2);

        savingGoal2.setId(savingGoal1.getId());
        assertThat(savingGoal1).isEqualTo(savingGoal2);

        savingGoal2 = getSavingGoalSample2();
        assertThat(savingGoal1).isNotEqualTo(savingGoal2);
    }
}
