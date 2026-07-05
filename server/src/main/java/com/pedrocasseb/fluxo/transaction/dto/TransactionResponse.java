package com.pedrocasseb.fluxo.transaction.dto;

import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionResponse(
    UUID id,
    String description,
    BigDecimal amount,
    LocalDate transactionDate,
    UUID categoryId,
    String categoryName,
    PaymentMethod paymentMethod,
    UUID installmentGroupId,
    Integer installmentNumber,
    Integer installmentTotal) {}
