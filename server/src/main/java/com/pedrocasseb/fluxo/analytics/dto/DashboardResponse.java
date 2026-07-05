package com.pedrocasseb.fluxo.analytics.dto;

import java.util.List;

public record DashboardResponse(
    DashboardSummary summary,
    DashboardComparisons comparisons,
    List<String> insights,
    List<CategoryExpenseDetail> expensesByCategory,
    List<PaymentMethodExpenseDetail> expensesByPaymentMethod,
    List<MonthlyEvolutionDetail> monthlyEvolution,
    DashboardProjections projections
) {}
