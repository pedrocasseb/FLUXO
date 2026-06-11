package com.pedrocasseb.fluxo.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateTransactionRequest(
        String description,
        BigDecimal amount,
        UUID categoryId,
        LocalDate transactionDate
) {
}
