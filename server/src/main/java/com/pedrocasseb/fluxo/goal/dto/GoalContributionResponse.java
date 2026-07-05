package com.pedrocasseb.fluxo.goal.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record GoalContributionResponse(
    UUID id,
    BigDecimal amount,
    LocalDate contributionDate,
    UUID transactionId,
    LocalDateTime createdAt) {}
