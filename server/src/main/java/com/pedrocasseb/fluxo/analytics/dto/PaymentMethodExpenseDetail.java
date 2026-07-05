package com.pedrocasseb.fluxo.analytics.dto;

import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import java.math.BigDecimal;

public record PaymentMethodExpenseDetail(
    PaymentMethod paymentMethod,
    BigDecimal amount,
    double percentage
) {}
