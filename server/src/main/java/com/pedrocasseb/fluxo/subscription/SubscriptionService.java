package com.pedrocasseb.fluxo.subscription;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.category.CategoryRepository;
import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.common.exception.CategoryNotFoundException;
import com.pedrocasseb.fluxo.common.exception.SubscriptionNotFoundException;
import com.pedrocasseb.fluxo.subscription.dto.CreateSubscriptionRequest;
import com.pedrocasseb.fluxo.subscription.dto.SubscriptionResponse;
import com.pedrocasseb.fluxo.subscription.dto.UpdateSubscriptionRequest;
import com.pedrocasseb.fluxo.transaction.FinancialTransaction;
import com.pedrocasseb.fluxo.transaction.TransactionRepository;
import com.pedrocasseb.fluxo.user.User;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

  private final SubscriptionRepository subscriptionRepository;
  private final TransactionRepository transactionRepository;
  private final CategoryRepository categoryRepository;

  @Transactional
  public SubscriptionResponse createSubscription(CreateSubscriptionRequest request, User user) {
    Subscription subscription = new Subscription();
    subscription.setName(request.name());
    subscription.setAmount(request.amount());
    subscription.setDueDay(request.dueDay());
    subscription.setPaymentMethod(request.paymentMethod());
    subscription.setCategory(resolveCategory(request.categoryId(), request.type(), user));
    subscription.setUser(user);
    subscription.setNextDueDate(firstOccurrence(LocalDate.now(), request.dueDay()));

    Subscription saved = subscriptionRepository.save(subscription);
    generateDueTransactions(saved, user);

    return toResponse(saved);
  }

  @Transactional
  public List<SubscriptionResponse> findAll(User user) {
    syncDueTransactions(user);
    return subscriptionRepository.findByUser(user).stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public SubscriptionResponse findById(UUID id, User user) {
    return toResponse(findSubscription(id, user));
  }

  @Transactional
  public SubscriptionResponse updateSubscription(UUID id, UpdateSubscriptionRequest request, User user) {
    Subscription subscription = findSubscription(id, user);

    if (request.name() != null) {
      subscription.setName(request.name());
    }
    if (request.amount() != null) {
      subscription.setAmount(request.amount());
    }
    if (request.paymentMethod() != null) {
      subscription.setPaymentMethod(request.paymentMethod());
    }
    if (request.categoryId() != null) {
      subscription.setCategory(resolveCategory(request.categoryId(), null, user));
    }
    if (request.dueDay() != null && !request.dueDay().equals(subscription.getDueDay())) {
      subscription.setDueDay(request.dueDay());
      subscription.setNextDueDate(firstOccurrence(LocalDate.now(), request.dueDay()));
    }

    Subscription saved = subscriptionRepository.save(subscription);
    return toResponse(saved);
  }

  public void delete(UUID id, User user) {
    Subscription subscription = findSubscription(id, user);
    subscriptionRepository.delete(subscription);
  }

  /**
   * Gera, sob demanda, as transações de todas as assinaturas do usuário cuja data de
   * vencimento já chegou (ou passou, se o backend ficou fora do ar). Chamado a partir dos
   * pontos de leitura (listagem de transações, dashboard, listagem de assinaturas).
   */
  @Transactional
  public void syncDueTransactions(User user) {
    List<Subscription> subscriptions = subscriptionRepository.findByUser(user);
    for (Subscription subscription : subscriptions) {
      generateDueTransactions(subscription, user);
    }
    subscriptionRepository.saveAll(subscriptions);
  }

  private void generateDueTransactions(Subscription subscription, User user) {
    LocalDate today = LocalDate.now();
    while (!subscription.getNextDueDate().isAfter(today)) {
      FinancialTransaction transaction = new FinancialTransaction();
      transaction.setDescription(subscription.getName());
      transaction.setAmount(subscription.getAmount());
      transaction.setTransactionDate(subscription.getNextDueDate());
      transaction.setPaymentMethod(subscription.getPaymentMethod());
      transaction.setCategory(subscription.getCategory());
      transaction.setSubscriptionId(subscription.getId());
      transaction.setUser(user);
      transactionRepository.save(transaction);

      subscription.setNextDueDate(nextOccurrence(subscription.getNextDueDate(), subscription.getDueDay()));
    }
  }

  private LocalDate firstOccurrence(LocalDate from, int dueDay) {
    LocalDate candidate = clampedDate(YearMonth.from(from), dueDay);
    return candidate.isBefore(from) ? clampedDate(YearMonth.from(from).plusMonths(1), dueDay) : candidate;
  }

  private LocalDate nextOccurrence(LocalDate current, int dueDay) {
    return clampedDate(YearMonth.from(current).plusMonths(1), dueDay);
  }

  private LocalDate clampedDate(YearMonth yearMonth, int dueDay) {
    return yearMonth.atDay(Math.min(dueDay, yearMonth.lengthOfMonth()));
  }

  private Subscription findSubscription(UUID id, User user) {
    return subscriptionRepository
        .findByIdAndUser(id, user)
        .orElseThrow(() -> new SubscriptionNotFoundException("Assinatura não encontrada"));
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

  private SubscriptionResponse toResponse(Subscription subscription) {
    return new SubscriptionResponse(
        subscription.getId(),
        subscription.getName(),
        subscription.getAmount(),
        subscription.getDueDay(),
        subscription.getPaymentMethod(),
        subscription.getCategory().getId(),
        subscription.getCategory().getName(),
        subscription.getNextDueDate(),
        subscription.getCreatedAt());
  }
}
