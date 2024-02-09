package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ExpenseCategory;
import com.mycompany.myapp.repository.ExpenseCategoryRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ExpenseCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExpenseCategoryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/expense-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExpenseCategoryMockMvc;

    private ExpenseCategory expenseCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExpenseCategory createEntity(EntityManager em) {
        ExpenseCategory expenseCategory = new ExpenseCategory().name(DEFAULT_NAME);
        return expenseCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExpenseCategory createUpdatedEntity(EntityManager em) {
        ExpenseCategory expenseCategory = new ExpenseCategory().name(UPDATED_NAME);
        return expenseCategory;
    }

    @BeforeEach
    public void initTest() {
        expenseCategory = createEntity(em);
    }

    @Test
    @Transactional
    void createExpenseCategory() throws Exception {
        int databaseSizeBeforeCreate = expenseCategoryRepository.findAll().size();
        // Create the ExpenseCategory
        restExpenseCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isCreated());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        ExpenseCategory testExpenseCategory = expenseCategoryList.get(expenseCategoryList.size() - 1);
        assertThat(testExpenseCategory.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createExpenseCategoryWithExistingId() throws Exception {
        // Create the ExpenseCategory with an existing ID
        expenseCategory.setId(1L);

        int databaseSizeBeforeCreate = expenseCategoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExpenseCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExpenseCategories() throws Exception {
        // Initialize the database
        expenseCategoryRepository.saveAndFlush(expenseCategory);

        // Get all the expenseCategoryList
        restExpenseCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(expenseCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getExpenseCategory() throws Exception {
        // Initialize the database
        expenseCategoryRepository.saveAndFlush(expenseCategory);

        // Get the expenseCategory
        restExpenseCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, expenseCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(expenseCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingExpenseCategory() throws Exception {
        // Get the expenseCategory
        restExpenseCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExpenseCategory() throws Exception {
        // Initialize the database
        expenseCategoryRepository.saveAndFlush(expenseCategory);

        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();

        // Update the expenseCategory
        ExpenseCategory updatedExpenseCategory = expenseCategoryRepository.findById(expenseCategory.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedExpenseCategory are not directly saved in db
        em.detach(updatedExpenseCategory);
        updatedExpenseCategory.name(UPDATED_NAME);

        restExpenseCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExpenseCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExpenseCategory))
            )
            .andExpect(status().isOk());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
        ExpenseCategory testExpenseCategory = expenseCategoryList.get(expenseCategoryList.size() - 1);
        assertThat(testExpenseCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingExpenseCategory() throws Exception {
        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();
        expenseCategory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExpenseCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, expenseCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExpenseCategory() throws Exception {
        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();
        expenseCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpenseCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExpenseCategory() throws Exception {
        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();
        expenseCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpenseCategoryMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExpenseCategoryWithPatch() throws Exception {
        // Initialize the database
        expenseCategoryRepository.saveAndFlush(expenseCategory);

        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();

        // Update the expenseCategory using partial update
        ExpenseCategory partialUpdatedExpenseCategory = new ExpenseCategory();
        partialUpdatedExpenseCategory.setId(expenseCategory.getId());

        partialUpdatedExpenseCategory.name(UPDATED_NAME);

        restExpenseCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExpenseCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExpenseCategory))
            )
            .andExpect(status().isOk());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
        ExpenseCategory testExpenseCategory = expenseCategoryList.get(expenseCategoryList.size() - 1);
        assertThat(testExpenseCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateExpenseCategoryWithPatch() throws Exception {
        // Initialize the database
        expenseCategoryRepository.saveAndFlush(expenseCategory);

        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();

        // Update the expenseCategory using partial update
        ExpenseCategory partialUpdatedExpenseCategory = new ExpenseCategory();
        partialUpdatedExpenseCategory.setId(expenseCategory.getId());

        partialUpdatedExpenseCategory.name(UPDATED_NAME);

        restExpenseCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExpenseCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExpenseCategory))
            )
            .andExpect(status().isOk());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
        ExpenseCategory testExpenseCategory = expenseCategoryList.get(expenseCategoryList.size() - 1);
        assertThat(testExpenseCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingExpenseCategory() throws Exception {
        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();
        expenseCategory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExpenseCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, expenseCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExpenseCategory() throws Exception {
        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();
        expenseCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpenseCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExpenseCategory() throws Exception {
        int databaseSizeBeforeUpdate = expenseCategoryRepository.findAll().size();
        expenseCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpenseCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(expenseCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExpenseCategory in the database
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExpenseCategory() throws Exception {
        // Initialize the database
        expenseCategoryRepository.saveAndFlush(expenseCategory);

        int databaseSizeBeforeDelete = expenseCategoryRepository.findAll().size();

        // Delete the expenseCategory
        restExpenseCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, expenseCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExpenseCategory> expenseCategoryList = expenseCategoryRepository.findAll();
        assertThat(expenseCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
