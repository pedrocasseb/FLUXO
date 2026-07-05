package com.pedrocasseb.fluxo.subscription.dto;

import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateSubscriptionRequest(
    @NotBlank(message = "Name is required")
    String name,

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    BigDecimal amount,

    @NotNull(message = "Due day is required")
    @Min(value = 1, message = "Due day must be between 1 and 31")
    @Max(value = 31, message = "Due day must be between 1 and 31")
    Integer dueDay,

    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod,

    UUID categoryId,

    CategoryType type
) {}
