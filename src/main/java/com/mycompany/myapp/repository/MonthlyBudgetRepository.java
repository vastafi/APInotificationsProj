package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.MonthlyBudget;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MonthlyBudget entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, Long> {
    @Query("select monthlyBudget from MonthlyBudget monthlyBudget where monthlyBudget.user.login = ?#{authentication.name}")
    List<MonthlyBudget> findByUserIsCurrentUser();
}
