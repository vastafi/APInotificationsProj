package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.SavingGoal;
import com.mycompany.myapp.repository.SavingGoalRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link SavingGoalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SavingGoalResourceIT {

    private static final BigDecimal DEFAULT_TARGET_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_TARGET_AMOUNT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_CURRENT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_CURRENT_AMOUNT = new BigDecimal(2);

    private static final LocalDate DEFAULT_TARGET_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_TARGET_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/saving-goals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SavingGoalRepository savingGoalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSavingGoalMockMvc;

    private SavingGoal savingGoal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SavingGoal createEntity(EntityManager em) {
        SavingGoal savingGoal = new SavingGoal()
            .targetAmount(DEFAULT_TARGET_AMOUNT)
            .currentAmount(DEFAULT_CURRENT_AMOUNT)
            .targetDate(DEFAULT_TARGET_DATE);
        return savingGoal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SavingGoal createUpdatedEntity(EntityManager em) {
        SavingGoal savingGoal = new SavingGoal()
            .targetAmount(UPDATED_TARGET_AMOUNT)
            .currentAmount(UPDATED_CURRENT_AMOUNT)
            .targetDate(UPDATED_TARGET_DATE);
        return savingGoal;
    }

    @BeforeEach
    public void initTest() {
        savingGoal = createEntity(em);
    }

    @Test
    @Transactional
    void createSavingGoal() throws Exception {
        int databaseSizeBeforeCreate = savingGoalRepository.findAll().size();
        // Create the SavingGoal
        restSavingGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(savingGoal)))
            .andExpect(status().isCreated());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeCreate + 1);
        SavingGoal testSavingGoal = savingGoalList.get(savingGoalList.size() - 1);
        assertThat(testSavingGoal.getTargetAmount()).isEqualByComparingTo(DEFAULT_TARGET_AMOUNT);
        assertThat(testSavingGoal.getCurrentAmount()).isEqualByComparingTo(DEFAULT_CURRENT_AMOUNT);
        assertThat(testSavingGoal.getTargetDate()).isEqualTo(DEFAULT_TARGET_DATE);
    }

    @Test
    @Transactional
    void createSavingGoalWithExistingId() throws Exception {
        // Create the SavingGoal with an existing ID
        savingGoal.setId(1L);

        int databaseSizeBeforeCreate = savingGoalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSavingGoalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(savingGoal)))
            .andExpect(status().isBadRequest());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSavingGoals() throws Exception {
        // Initialize the database
        savingGoalRepository.saveAndFlush(savingGoal);

        // Get all the savingGoalList
        restSavingGoalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(savingGoal.getId().intValue())))
            .andExpect(jsonPath("$.[*].targetAmount").value(hasItem(sameNumber(DEFAULT_TARGET_AMOUNT))))
            .andExpect(jsonPath("$.[*].currentAmount").value(hasItem(sameNumber(DEFAULT_CURRENT_AMOUNT))))
            .andExpect(jsonPath("$.[*].targetDate").value(hasItem(DEFAULT_TARGET_DATE.toString())));
    }

    @Test
    @Transactional
    void getSavingGoal() throws Exception {
        // Initialize the database
        savingGoalRepository.saveAndFlush(savingGoal);

        // Get the savingGoal
        restSavingGoalMockMvc
            .perform(get(ENTITY_API_URL_ID, savingGoal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(savingGoal.getId().intValue()))
            .andExpect(jsonPath("$.targetAmount").value(sameNumber(DEFAULT_TARGET_AMOUNT)))
            .andExpect(jsonPath("$.currentAmount").value(sameNumber(DEFAULT_CURRENT_AMOUNT)))
            .andExpect(jsonPath("$.targetDate").value(DEFAULT_TARGET_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSavingGoal() throws Exception {
        // Get the savingGoal
        restSavingGoalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSavingGoal() throws Exception {
        // Initialize the database
        savingGoalRepository.saveAndFlush(savingGoal);

        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();

        // Update the savingGoal
        SavingGoal updatedSavingGoal = savingGoalRepository.findById(savingGoal.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSavingGoal are not directly saved in db
        em.detach(updatedSavingGoal);
        updatedSavingGoal.targetAmount(UPDATED_TARGET_AMOUNT).currentAmount(UPDATED_CURRENT_AMOUNT).targetDate(UPDATED_TARGET_DATE);

        restSavingGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSavingGoal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSavingGoal))
            )
            .andExpect(status().isOk());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
        SavingGoal testSavingGoal = savingGoalList.get(savingGoalList.size() - 1);
        assertThat(testSavingGoal.getTargetAmount()).isEqualByComparingTo(UPDATED_TARGET_AMOUNT);
        assertThat(testSavingGoal.getCurrentAmount()).isEqualByComparingTo(UPDATED_CURRENT_AMOUNT);
        assertThat(testSavingGoal.getTargetDate()).isEqualTo(UPDATED_TARGET_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSavingGoal() throws Exception {
        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();
        savingGoal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSavingGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, savingGoal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(savingGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSavingGoal() throws Exception {
        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();
        savingGoal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSavingGoalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(savingGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSavingGoal() throws Exception {
        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();
        savingGoal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSavingGoalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(savingGoal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSavingGoalWithPatch() throws Exception {
        // Initialize the database
        savingGoalRepository.saveAndFlush(savingGoal);

        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();

        // Update the savingGoal using partial update
        SavingGoal partialUpdatedSavingGoal = new SavingGoal();
        partialUpdatedSavingGoal.setId(savingGoal.getId());

        partialUpdatedSavingGoal.currentAmount(UPDATED_CURRENT_AMOUNT);

        restSavingGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSavingGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSavingGoal))
            )
            .andExpect(status().isOk());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
        SavingGoal testSavingGoal = savingGoalList.get(savingGoalList.size() - 1);
        assertThat(testSavingGoal.getTargetAmount()).isEqualByComparingTo(DEFAULT_TARGET_AMOUNT);
        assertThat(testSavingGoal.getCurrentAmount()).isEqualByComparingTo(UPDATED_CURRENT_AMOUNT);
        assertThat(testSavingGoal.getTargetDate()).isEqualTo(DEFAULT_TARGET_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSavingGoalWithPatch() throws Exception {
        // Initialize the database
        savingGoalRepository.saveAndFlush(savingGoal);

        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();

        // Update the savingGoal using partial update
        SavingGoal partialUpdatedSavingGoal = new SavingGoal();
        partialUpdatedSavingGoal.setId(savingGoal.getId());

        partialUpdatedSavingGoal.targetAmount(UPDATED_TARGET_AMOUNT).currentAmount(UPDATED_CURRENT_AMOUNT).targetDate(UPDATED_TARGET_DATE);

        restSavingGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSavingGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSavingGoal))
            )
            .andExpect(status().isOk());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
        SavingGoal testSavingGoal = savingGoalList.get(savingGoalList.size() - 1);
        assertThat(testSavingGoal.getTargetAmount()).isEqualByComparingTo(UPDATED_TARGET_AMOUNT);
        assertThat(testSavingGoal.getCurrentAmount()).isEqualByComparingTo(UPDATED_CURRENT_AMOUNT);
        assertThat(testSavingGoal.getTargetDate()).isEqualTo(UPDATED_TARGET_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSavingGoal() throws Exception {
        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();
        savingGoal.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSavingGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, savingGoal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(savingGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSavingGoal() throws Exception {
        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();
        savingGoal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSavingGoalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(savingGoal))
            )
            .andExpect(status().isBadRequest());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSavingGoal() throws Exception {
        int databaseSizeBeforeUpdate = savingGoalRepository.findAll().size();
        savingGoal.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSavingGoalMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(savingGoal))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SavingGoal in the database
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSavingGoal() throws Exception {
        // Initialize the database
        savingGoalRepository.saveAndFlush(savingGoal);

        int databaseSizeBeforeDelete = savingGoalRepository.findAll().size();

        // Delete the savingGoal
        restSavingGoalMockMvc
            .perform(delete(ENTITY_API_URL_ID, savingGoal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SavingGoal> savingGoalList = savingGoalRepository.findAll();
        assertThat(savingGoalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
