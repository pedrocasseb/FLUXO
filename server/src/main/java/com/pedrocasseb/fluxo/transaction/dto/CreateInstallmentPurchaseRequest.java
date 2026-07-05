package com.pedrocasseb.fluxo.transaction.dto;

import com.pedrocasseb.fluxo.category.CategoryType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateInstallmentPurchaseRequest(
    @NotBlank(message = "Description is required")
    String description,

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be greater than zero")
    BigDecimal totalAmount,

    @NotNull(message = "Installments is required")
    @Min(value = 2, message = "Installments must be at least 2")
    @Max(value = 60, message = "Installments must be at most 60")
    Integer installments,

    UUID categoryId,

    CategoryType type,

    @NotNull(message = "First installment date is required")
    LocalDate firstInstallmentDate
) {}
