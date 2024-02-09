package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.MonthlyBudget;
import com.mycompany.myapp.repository.MonthlyBudgetRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.MonthlyBudget}.
 */
@RestController
@RequestMapping("/api/monthly-budgets")
@Transactional
public class MonthlyBudgetResource {

    private final Logger log = LoggerFactory.getLogger(MonthlyBudgetResource.class);

    private static final String ENTITY_NAME = "monthlyBudget";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MonthlyBudgetRepository monthlyBudgetRepository;

    public MonthlyBudgetResource(MonthlyBudgetRepository monthlyBudgetRepository) {
        this.monthlyBudgetRepository = monthlyBudgetRepository;
    }

    /**
     * {@code POST  /monthly-budgets} : Create a new monthlyBudget.
     *
     * @param monthlyBudget the monthlyBudget to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new monthlyBudget, or with status {@code 400 (Bad Request)} if the monthlyBudget has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<MonthlyBudget> createMonthlyBudget(@RequestBody MonthlyBudget monthlyBudget) throws URISyntaxException {
        log.debug("REST request to save MonthlyBudget : {}", monthlyBudget);
        if (monthlyBudget.getId() != null) {
            throw new BadRequestAlertException("A new monthlyBudget cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MonthlyBudget result = monthlyBudgetRepository.save(monthlyBudget);
        return ResponseEntity
            .created(new URI("/api/monthly-budgets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /monthly-budgets/:id} : Updates an existing monthlyBudget.
     *
     * @param id the id of the monthlyBudget to save.
     * @param monthlyBudget the monthlyBudget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated monthlyBudget,
     * or with status {@code 400 (Bad Request)} if the monthlyBudget is not valid,
     * or with status {@code 500 (Internal Server Error)} if the monthlyBudget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<MonthlyBudget> updateMonthlyBudget(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MonthlyBudget monthlyBudget
    ) throws URISyntaxException {
        log.debug("REST request to update MonthlyBudget : {}, {}", id, monthlyBudget);
        if (monthlyBudget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, monthlyBudget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!monthlyBudgetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MonthlyBudget result = monthlyBudgetRepository.save(monthlyBudget);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, monthlyBudget.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /monthly-budgets/:id} : Partial updates given fields of an existing monthlyBudget, field will ignore if it is null
     *
     * @param id the id of the monthlyBudget to save.
     * @param monthlyBudget the monthlyBudget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated monthlyBudget,
     * or with status {@code 400 (Bad Request)} if the monthlyBudget is not valid,
     * or with status {@code 404 (Not Found)} if the monthlyBudget is not found,
     * or with status {@code 500 (Internal Server Error)} if the monthlyBudget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MonthlyBudget> partialUpdateMonthlyBudget(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MonthlyBudget monthlyBudget
    ) throws URISyntaxException {
        log.debug("REST request to partial update MonthlyBudget partially : {}, {}", id, monthlyBudget);
        if (monthlyBudget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, monthlyBudget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!monthlyBudgetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MonthlyBudget> result = monthlyBudgetRepository
            .findById(monthlyBudget.getId())
            .map(existingMonthlyBudget -> {
                if (monthlyBudget.getAmount() != null) {
                    existingMonthlyBudget.setAmount(monthlyBudget.getAmount());
                }

                return existingMonthlyBudget;
            })
            .map(monthlyBudgetRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, monthlyBudget.getId().toString())
        );
    }

    /**
     * {@code GET  /monthly-budgets} : get all the monthlyBudgets.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of monthlyBudgets in body.
     */
    @GetMapping("")
    public ResponseEntity<List<MonthlyBudget>> getAllMonthlyBudgets(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of MonthlyBudgets");
        Page<MonthlyBudget> page = monthlyBudgetRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /monthly-budgets/:id} : get the "id" monthlyBudget.
     *
     * @param id the id of the monthlyBudget to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the monthlyBudget, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MonthlyBudget> getMonthlyBudget(@PathVariable("id") Long id) {
        log.debug("REST request to get MonthlyBudget : {}", id);
        Optional<MonthlyBudget> monthlyBudget = monthlyBudgetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(monthlyBudget);
    }

    /**
     * {@code DELETE  /monthly-budgets/:id} : delete the "id" monthlyBudget.
     *
     * @param id the id of the monthlyBudget to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonthlyBudget(@PathVariable("id") Long id) {
        log.debug("REST request to delete MonthlyBudget : {}", id);
        monthlyBudgetRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
