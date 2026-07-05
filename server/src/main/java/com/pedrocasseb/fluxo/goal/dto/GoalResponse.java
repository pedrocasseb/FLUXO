package com.pedrocasseb.fluxo.goal.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record GoalResponse(
    UUID id,
    String name,
    BigDecimal targetAmount,
    BigDecimal currentAmount,
    boolean completed,
    LocalDateTime createdAt) {}
