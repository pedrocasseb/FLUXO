package com.pedrocasseb.fluxo.subscription.dto;

import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record UpdateSubscriptionRequest(
    String name,

    @Positive(message = "Amount must be greater than zero")
    BigDecimal amount,

    @Min(value = 1, message = "Due day must be between 1 and 31")
    @Max(value = 31, message = "Due day must be between 1 and 31")
    Integer dueDay,

    PaymentMethod paymentMethod,

    UUID categoryId
) {}
