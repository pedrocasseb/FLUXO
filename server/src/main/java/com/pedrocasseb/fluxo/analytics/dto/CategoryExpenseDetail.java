package com.pedrocasseb.fluxo.analytics.dto;

import java.math.BigDecimal;

public record CategoryExpenseDetail(
    String category,
    BigDecimal amount,
    double percentage
) {}
