package com.pedrocasseb.fluxo.analytics.dto;

import java.math.BigDecimal;

public record DashboardSummary(
    BigDecimal balance,
    BigDecimal income,
    BigDecimal expense,
    BigDecimal investment,
    BigDecimal saving
) {}
