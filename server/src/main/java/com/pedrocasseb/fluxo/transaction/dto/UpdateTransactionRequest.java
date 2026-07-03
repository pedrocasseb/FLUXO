package com.pedrocasseb.fluxo.transaction.dto;

import com.pedrocasseb.fluxo.category.CategoryType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateTransactionRequest(
    String description, BigDecimal amount, UUID categoryId, CategoryType type, LocalDate transactionDate) {}
