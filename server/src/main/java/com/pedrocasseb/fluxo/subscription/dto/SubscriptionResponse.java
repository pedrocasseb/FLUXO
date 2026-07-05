package com.pedrocasseb.fluxo.subscription.dto;

import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record SubscriptionResponse(
    UUID id,
    String name,
    BigDecimal amount,
    Integer dueDay,
    PaymentMethod paymentMethod,
    UUID categoryId,
    String categoryName,
    LocalDate nextDueDate,
    LocalDateTime createdAt) {}
