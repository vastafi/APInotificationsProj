package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ExpenseCategory;
import com.mycompany.myapp.repository.ExpenseCategoryRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ExpenseCategory}.
 */
@RestController
@RequestMapping("/api/expense-categories")
@Transactional
public class ExpenseCategoryResource {

    private final Logger log = LoggerFactory.getLogger(ExpenseCategoryResource.class);

    private static final String ENTITY_NAME = "expenseCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExpenseCategoryRepository expenseCategoryRepository;

    public ExpenseCategoryResource(ExpenseCategoryRepository expenseCategoryRepository) {
        this.expenseCategoryRepository = expenseCategoryRepository;
    }

    /**
     * {@code POST  /expense-categories} : Create a new expenseCategory.
     *
     * @param expenseCategory the expenseCategory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new expenseCategory, or with status {@code 400 (Bad Request)} if the expenseCategory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ExpenseCategory> createExpenseCategory(@RequestBody ExpenseCategory expenseCategory) throws URISyntaxException {
        log.debug("REST request to save ExpenseCategory : {}", expenseCategory);
        if (expenseCategory.getId() != null) {
            throw new BadRequestAlertException("A new expenseCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExpenseCategory result = expenseCategoryRepository.save(expenseCategory);
        return ResponseEntity
            .created(new URI("/api/expense-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /expense-categories/:id} : Updates an existing expenseCategory.
     *
     * @param id the id of the expenseCategory to save.
     * @param expenseCategory the expenseCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expenseCategory,
     * or with status {@code 400 (Bad Request)} if the expenseCategory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the expenseCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseCategory> updateExpenseCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExpenseCategory expenseCategory
    ) throws URISyntaxException {
        log.debug("REST request to update ExpenseCategory : {}, {}", id, expenseCategory);
        if (expenseCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expenseCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expenseCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExpenseCategory result = expenseCategoryRepository.save(expenseCategory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expenseCategory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /expense-categories/:id} : Partial updates given fields of an existing expenseCategory, field will ignore if it is null
     *
     * @param id the id of the expenseCategory to save.
     * @param expenseCategory the expenseCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expenseCategory,
     * or with status {@code 400 (Bad Request)} if the expenseCategory is not valid,
     * or with status {@code 404 (Not Found)} if the expenseCategory is not found,
     * or with status {@code 500 (Internal Server Error)} if the expenseCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExpenseCategory> partialUpdateExpenseCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExpenseCategory expenseCategory
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExpenseCategory partially : {}, {}", id, expenseCategory);
        if (expenseCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expenseCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expenseCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExpenseCategory> result = expenseCategoryRepository
            .findById(expenseCategory.getId())
            .map(existingExpenseCategory -> {
                if (expenseCategory.getName() != null) {
                    existingExpenseCategory.setName(expenseCategory.getName());
                }

                return existingExpenseCategory;
            })
            .map(expenseCategoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expenseCategory.getId().toString())
        );
    }

    /**
     * {@code GET  /expense-categories} : get all the expenseCategories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of expenseCategories in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ExpenseCategory>> getAllExpenseCategories(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of ExpenseCategories");
        Page<ExpenseCategory> page = expenseCategoryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /expense-categories/:id} : get the "id" expenseCategory.
     *
     * @param id the id of the expenseCategory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the expenseCategory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseCategory> getExpenseCategory(@PathVariable("id") Long id) {
        log.debug("REST request to get ExpenseCategory : {}", id);
        Optional<ExpenseCategory> expenseCategory = expenseCategoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(expenseCategory);
    }

    /**
     * {@code DELETE  /expense-categories/:id} : delete the "id" expenseCategory.
     *
     * @param id the id of the expenseCategory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpenseCategory(@PathVariable("id") Long id) {
        log.debug("REST request to delete ExpenseCategory : {}", id);
        expenseCategoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
