package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.MonthlyBudget;
import com.mycompany.myapp.repository.MonthlyBudgetRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link MonthlyBudgetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MonthlyBudgetResourceIT {

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/monthly-budgets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MonthlyBudgetRepository monthlyBudgetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMonthlyBudgetMockMvc;

    private MonthlyBudget monthlyBudget;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MonthlyBudget createEntity(EntityManager em) {
        MonthlyBudget monthlyBudget = new MonthlyBudget().amount(DEFAULT_AMOUNT);
        return monthlyBudget;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MonthlyBudget createUpdatedEntity(EntityManager em) {
        MonthlyBudget monthlyBudget = new MonthlyBudget().amount(UPDATED_AMOUNT);
        return monthlyBudget;
    }

    @BeforeEach
    public void initTest() {
        monthlyBudget = createEntity(em);
    }

    @Test
    @Transactional
    void createMonthlyBudget() throws Exception {
        int databaseSizeBeforeCreate = monthlyBudgetRepository.findAll().size();
        // Create the MonthlyBudget
        restMonthlyBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(monthlyBudget)))
            .andExpect(status().isCreated());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeCreate + 1);
        MonthlyBudget testMonthlyBudget = monthlyBudgetList.get(monthlyBudgetList.size() - 1);
        assertThat(testMonthlyBudget.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    void createMonthlyBudgetWithExistingId() throws Exception {
        // Create the MonthlyBudget with an existing ID
        monthlyBudget.setId(1L);

        int databaseSizeBeforeCreate = monthlyBudgetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMonthlyBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(monthlyBudget)))
            .andExpect(status().isBadRequest());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMonthlyBudgets() throws Exception {
        // Initialize the database
        monthlyBudgetRepository.saveAndFlush(monthlyBudget);

        // Get all the monthlyBudgetList
        restMonthlyBudgetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(monthlyBudget.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))));
    }

    @Test
    @Transactional
    void getMonthlyBudget() throws Exception {
        // Initialize the database
        monthlyBudgetRepository.saveAndFlush(monthlyBudget);

        // Get the monthlyBudget
        restMonthlyBudgetMockMvc
            .perform(get(ENTITY_API_URL_ID, monthlyBudget.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(monthlyBudget.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)));
    }

    @Test
    @Transactional
    void getNonExistingMonthlyBudget() throws Exception {
        // Get the monthlyBudget
        restMonthlyBudgetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMonthlyBudget() throws Exception {
        // Initialize the database
        monthlyBudgetRepository.saveAndFlush(monthlyBudget);

        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();

        // Update the monthlyBudget
        MonthlyBudget updatedMonthlyBudget = monthlyBudgetRepository.findById(monthlyBudget.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMonthlyBudget are not directly saved in db
        em.detach(updatedMonthlyBudget);
        updatedMonthlyBudget.amount(UPDATED_AMOUNT);

        restMonthlyBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMonthlyBudget.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMonthlyBudget))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
        MonthlyBudget testMonthlyBudget = monthlyBudgetList.get(monthlyBudgetList.size() - 1);
        assertThat(testMonthlyBudget.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingMonthlyBudget() throws Exception {
        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();
        monthlyBudget.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMonthlyBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, monthlyBudget.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMonthlyBudget() throws Exception {
        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();
        monthlyBudget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMonthlyBudget() throws Exception {
        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();
        monthlyBudget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyBudgetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(monthlyBudget)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMonthlyBudgetWithPatch() throws Exception {
        // Initialize the database
        monthlyBudgetRepository.saveAndFlush(monthlyBudget);

        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();

        // Update the monthlyBudget using partial update
        MonthlyBudget partialUpdatedMonthlyBudget = new MonthlyBudget();
        partialUpdatedMonthlyBudget.setId(monthlyBudget.getId());

        restMonthlyBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMonthlyBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMonthlyBudget))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
        MonthlyBudget testMonthlyBudget = monthlyBudgetList.get(monthlyBudgetList.size() - 1);
        assertThat(testMonthlyBudget.getAmount()).isEqualByComparingTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateMonthlyBudgetWithPatch() throws Exception {
        // Initialize the database
        monthlyBudgetRepository.saveAndFlush(monthlyBudget);

        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();

        // Update the monthlyBudget using partial update
        MonthlyBudget partialUpdatedMonthlyBudget = new MonthlyBudget();
        partialUpdatedMonthlyBudget.setId(monthlyBudget.getId());

        partialUpdatedMonthlyBudget.amount(UPDATED_AMOUNT);

        restMonthlyBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMonthlyBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMonthlyBudget))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
        MonthlyBudget testMonthlyBudget = monthlyBudgetList.get(monthlyBudgetList.size() - 1);
        assertThat(testMonthlyBudget.getAmount()).isEqualByComparingTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingMonthlyBudget() throws Exception {
        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();
        monthlyBudget.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMonthlyBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, monthlyBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMonthlyBudget() throws Exception {
        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();
        monthlyBudget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMonthlyBudget() throws Exception {
        int databaseSizeBeforeUpdate = monthlyBudgetRepository.findAll().size();
        monthlyBudget.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(monthlyBudget))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MonthlyBudget in the database
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMonthlyBudget() throws Exception {
        // Initialize the database
        monthlyBudgetRepository.saveAndFlush(monthlyBudget);

        int databaseSizeBeforeDelete = monthlyBudgetRepository.findAll().size();

        // Delete the monthlyBudget
        restMonthlyBudgetMockMvc
            .perform(delete(ENTITY_API_URL_ID, monthlyBudget.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MonthlyBudget> monthlyBudgetList = monthlyBudgetRepository.findAll();
        assertThat(monthlyBudgetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
