package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ExpenseCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ExpenseCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {}
