package com.pedrocasseb.fluxo.goal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record CreateGoalRequest(
    @NotBlank(message = "Name is required")
    String name,

    @NotNull(message = "Target amount is required")
    @Positive(message = "Target amount must be greater than zero")
    BigDecimal targetAmount
) {}
