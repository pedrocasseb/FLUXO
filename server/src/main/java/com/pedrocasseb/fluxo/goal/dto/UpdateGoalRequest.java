package com.pedrocasseb.fluxo.goal.dto;

import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record UpdateGoalRequest(
    String name,

    @Positive(message = "Target amount must be greater than zero")
    BigDecimal targetAmount
) {}
