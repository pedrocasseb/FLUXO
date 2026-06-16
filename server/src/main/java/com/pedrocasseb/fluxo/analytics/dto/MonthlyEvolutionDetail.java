package com.pedrocasseb.fluxo.analytics.dto;

import java.math.BigDecimal;

public record MonthlyEvolutionDetail(
    String month,
    BigDecimal income,
    BigDecimal expense,
    BigDecimal investment,
    BigDecimal saving
) {}
