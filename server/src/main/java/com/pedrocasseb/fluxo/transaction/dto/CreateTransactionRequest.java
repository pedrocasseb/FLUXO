package com.pedrocasseb.fluxo.transaction.dto;

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

    @NotNull(message = "Transaction date is required")
    LocalDate transactionDate
) {}
