package com.pedrocasseb.fluxo.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionResponse(
    UUID id,
    String description,
    BigDecimal amount,
    LocalDate transactionDate,
    UUID categoryId,
    String categoryName) {}
