package com.pedrocasseb.fluxo.transaction;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.category.CategoryRepository;
import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.common.exception.CategoryNotFoundException;
import com.pedrocasseb.fluxo.common.exception.TransactionNotFoundException;
import com.pedrocasseb.fluxo.transaction.dto.CreateTransactionRequest;
import com.pedrocasseb.fluxo.transaction.dto.TransactionResponse;
import com.pedrocasseb.fluxo.transaction.dto.UpdateTransactionRequest;
import com.pedrocasseb.fluxo.user.User;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

  private final TransactionRepository transactionRepository;
  private final CategoryRepository categoryRepository;

  public TransactionResponse create(CreateTransactionRequest request, User user) {
    Category category;

    if (request.categoryId() == null) {
      category = categoryRepository
          .findByNameIgnoreCaseAndUser("Other", user)
          .orElseGet(() -> {
            Category defaultCategory = new Category();
            defaultCategory.setName("Other");
            defaultCategory.setType(CategoryType.EXPENSE);
            defaultCategory.setUser(user);
            return categoryRepository.save(defaultCategory);
          });
    } else {
      category = categoryRepository
          .findByIdAndUser(request.categoryId(), user)
          .orElseThrow(() -> new CategoryNotFoundException("Categoria não encontrada"));
    }

    FinancialTransaction transaction = new FinancialTransaction();

    transaction.setDescription(request.description());
    transaction.setAmount(request.amount());
    transaction.setTransactionDate(request.transactionDate());
    transaction.setCategory(category);
    transaction.setUser(user);

    FinancialTransaction saved = transactionRepository.save(transaction);

    return toResponse(saved);
  }

  public List<TransactionResponse> findAll(User user) {
    return transactionRepository.findByUser(user).stream().map(this::toResponse).toList();
  }

  public void delete(UUID id, User user) {
    FinancialTransaction transaction =
        transactionRepository
            .findByIdAndUser(id, user)
            .orElseThrow(() -> new TransactionNotFoundException("Transação não encontrada"));
    transactionRepository.delete(transaction);
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

    if (request.categoryId() != null) {
      Category category =
          categoryRepository
              .findByIdAndUser(request.categoryId(), user)
              .orElseThrow(() -> new CategoryNotFoundException("Categoria não encontrada"));
      transaction.setCategory(category);
    }

    if (request.description() != null) {
      transaction.setDescription(request.description());
    }
    if (request.amount() != null) {
      transaction.setAmount(request.amount());
    }
    if (request.transactionDate() != null) {
      transaction.setTransactionDate(request.transactionDate());
    }

    FinancialTransaction saved = transactionRepository.save(transaction);
    return toResponse(saved);
  }

  private TransactionResponse toResponse(FinancialTransaction transaction) {
    return new TransactionResponse(
        transaction.getId(),
        transaction.getDescription(),
        transaction.getAmount(),
        transaction.getTransactionDate(),
        transaction.getCategory().getId(),
        transaction.getCategory().getName());
  }
}
