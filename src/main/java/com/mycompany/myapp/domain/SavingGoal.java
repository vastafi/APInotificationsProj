package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A SavingGoal.
 */
@Entity
@Table(name = "saving_goal")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SavingGoal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "target_amount", precision = 21, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "current_amount", precision = 21, scale = 2)
    private BigDecimal currentAmount;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SavingGoal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTargetAmount() {
        return this.targetAmount;
    }

    public SavingGoal targetAmount(BigDecimal targetAmount) {
        this.setTargetAmount(targetAmount);
        return this;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getCurrentAmount() {
        return this.currentAmount;
    }

    public SavingGoal currentAmount(BigDecimal currentAmount) {
        this.setCurrentAmount(currentAmount);
        return this;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public LocalDate getTargetDate() {
        return this.targetDate;
    }

    public SavingGoal targetDate(LocalDate targetDate) {
        this.setTargetDate(targetDate);
        return this;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SavingGoal user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SavingGoal)) {
            return false;
        }
        return getId() != null && getId().equals(((SavingGoal) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SavingGoal{" +
            "id=" + getId() +
            ", targetAmount=" + getTargetAmount() +
            ", currentAmount=" + getCurrentAmount() +
            ", targetDate='" + getTargetDate() + "'" +
            "}";
    }
}
