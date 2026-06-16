package com.pedrocasseb.fluxo.analytics.dto;

import java.math.BigDecimal;

public record ComparisonDetail(
    BigDecimal current,
    BigDecimal previous,
    BigDecimal difference,
    double percentage
) {}
