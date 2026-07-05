package com.pedrocasseb.fluxo.transaction.dto;

import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateTransactionRequest(
    @NotBlank(message = "Description is required")
    String description,

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    BigDecimal amount,

    UUID categoryId,

    CategoryType type,

    @NotNull(message = "Transaction date is required")
    LocalDate transactionDate,

    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod
) {}
