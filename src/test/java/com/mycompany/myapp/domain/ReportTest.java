package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ReportTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReportTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Report.class);
        Report report1 = getReportSample1();
        Report report2 = new Report();
        assertThat(report1).isNotEqualTo(report2);

        report2.setId(report1.getId());
        assertThat(report1).isEqualTo(report2);

        report2 = getReportSample2();
        assertThat(report1).isNotEqualTo(report2);
    }
}
