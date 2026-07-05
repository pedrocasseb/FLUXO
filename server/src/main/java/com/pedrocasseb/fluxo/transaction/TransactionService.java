package com.pedrocasseb.fluxo.transaction;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.category.CategoryRepository;
import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.common.exception.CategoryNotFoundException;
import com.pedrocasseb.fluxo.common.exception.TransactionNotFoundException;
import com.pedrocasseb.fluxo.subscription.SubscriptionService;
import com.pedrocasseb.fluxo.transaction.dto.CreateInstallmentPurchaseRequest;
import com.pedrocasseb.fluxo.transaction.dto.CreateTransactionRequest;
import com.pedrocasseb.fluxo.transaction.dto.TransactionResponse;
import com.pedrocasseb.fluxo.transaction.dto.UpdateTransactionRequest;
import com.pedrocasseb.fluxo.user.User;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

  private final TransactionRepository transactionRepository;
  private final CategoryRepository categoryRepository;
  private final SubscriptionService subscriptionService;

  public TransactionResponse create(CreateTransactionRequest request, User user) {
    Category category = resolveCategory(request.categoryId(), request.type(), user);

    FinancialTransaction transaction = new FinancialTransaction();

    transaction.setDescription(request.description());
    transaction.setAmount(request.amount());
    transaction.setTransactionDate(request.transactionDate());
    transaction.setPaymentMethod(request.paymentMethod());
    transaction.setCategory(category);
    transaction.setUser(user);

    FinancialTransaction saved = transactionRepository.save(transaction);

    return toResponse(saved);
  }

  @Transactional
  public List<TransactionResponse> createInstallmentPurchase(
      CreateInstallmentPurchaseRequest request, User user) {
    Category category = resolveCategory(request.categoryId(), request.type(), user);

    int installments = request.installments();
    BigDecimal installmentAmount =
        request.totalAmount().divide(BigDecimal.valueOf(installments), 2, RoundingMode.HALF_UP);
    BigDecimal lastInstallmentAmount =
        request.totalAmount().subtract(installmentAmount.multiply(BigDecimal.valueOf(installments - 1)));

    UUID groupId = UUID.randomUUID();
    List<FinancialTransaction> transactions = new ArrayList<>();

    for (int i = 1; i <= installments; i++) {
      FinancialTransaction transaction = new FinancialTransaction();
      transaction.setDescription(request.description() + " (" + i + "/" + installments + ")");
      transaction.setAmount(i == installments ? lastInstallmentAmount : installmentAmount);
      transaction.setTransactionDate(request.firstInstallmentDate().plusMonths(i - 1));
      transaction.setPaymentMethod(PaymentMethod.CREDIT);
      transaction.setInstallmentGroupId(groupId);
      transaction.setInstallmentNumber(i);
      transaction.setInstallmentTotal(installments);
      transaction.setCategory(category);
      transaction.setUser(user);
      transactions.add(transaction);
    }

    return transactionRepository.saveAll(transactions).stream().map(this::toResponse).toList();
  }

  public List<TransactionResponse> findAll(User user) {
    subscriptionService.syncDueTransactions(user);
    return transactionRepository.findByUser(user).stream().map(this::toResponse).toList();
  }

  public void delete(UUID id, User user) {
    FinancialTransaction transaction =
        transactionRepository
            .findByIdAndUser(id, user)
            .orElseThrow(() -> new TransactionNotFoundException("Transação não encontrada"));

    if (transaction.getInstallmentGroupId() != null) {
      List<FinancialTransaction> group =
          transactionRepository.findByInstallmentGroupIdAndUser(transaction.getInstallmentGroupId(), user);
      transactionRepository.deleteAll(group);
    } else {
      transactionRepository.delete(transaction);
    }
  }

  public TransactionResponse findById(UUID id, User user) {
    FinancialTransaction transaction =
        transactionRepository
            .findByIdAndUser(id, user)
            .orElseThrow(() -> new TransactionNotFoundException("Transação não encontrada"));

    return toResponse(transaction);
  }

  public TransactionResponse update(UUID id, UpdateTransactionRequest request, User user) {
    FinancialTransaction transaction =
        transactionRepository
            .findByIdAndUser(id, user)
            .orElseThrow(() -> new TransactionNotFoundException("Transação não encontrada"));

    transaction.setCategory(resolveCategory(request.categoryId(), request.type(), user));

    if (request.description() != null) {
      transaction.setDescription(request.description());
    }
    if (request.amount() != null) {
      transaction.setAmount(request.amount());
    }
    if (request.transactionDate() != null) {
      transaction.setTransactionDate(request.transactionDate());
    }
    if (request.paymentMethod() != null) {
      transaction.setPaymentMethod(request.paymentMethod());
    }

    FinancialTransaction saved = transactionRepository.save(transaction);
    return toResponse(saved);
  }

  private Category resolveCategory(UUID categoryId, CategoryType type, User user) {
    if (categoryId != null) {
      return categoryRepository
          .findByIdAndUser(categoryId, user)
          .orElseThrow(() -> new CategoryNotFoundException("Categoria não encontrada"));
    }

    CategoryType resolvedType = type != null ? type : CategoryType.EXPENSE;
    return categoryRepository
        .findByNameIgnoreCaseAndTypeAndUser("Other", resolvedType, user)
        .orElseGet(() -> {
          Category defaultCategory = new Category();
          defaultCategory.setName("Other");
          defaultCategory.setType(resolvedType);
          defaultCategory.setUser(user);
          return categoryRepository.save(defaultCategory);
        });
  }

  private TransactionResponse toResponse(FinancialTransaction transaction) {
    return new TransactionResponse(
        transaction.getId(),
        transaction.getDescription(),
        transaction.getAmount(),
        transaction.getTransactionDate(),
        transaction.getCategory().getId(),
        transaction.getCategory().getName(),
        transaction.getPaymentMethod(),
        transaction.getInstallmentGroupId(),
        transaction.getInstallmentNumber(),
        transaction.getInstallmentTotal(),
        transaction.getSubscriptionId());
  }
}
