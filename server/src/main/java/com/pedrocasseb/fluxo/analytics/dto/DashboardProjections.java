package com.pedrocasseb.fluxo.analytics.dto;

import java.math.BigDecimal;

public record DashboardProjections(
    BigDecimal projectedExpense,
    BigDecimal projectedInvestment
) {}
