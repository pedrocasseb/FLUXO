package com.pedrocasseb.fluxo.analytics.dto;

public record DashboardComparisons(
    ComparisonDetail income,
    ComparisonDetail expense,
    ComparisonDetail investment,
    ComparisonDetail saving
) {}
