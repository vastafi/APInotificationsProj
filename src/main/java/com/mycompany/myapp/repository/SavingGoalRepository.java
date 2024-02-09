package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SavingGoal;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SavingGoal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {
    @Query("select savingGoal from SavingGoal savingGoal where savingGoal.user.login = ?#{authentication.name}")
    List<SavingGoal> findByUserIsCurrentUser();
}
