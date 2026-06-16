package com.pedrocasseb.fluxo.transaction;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.category.CategoryRepository;
import com.pedrocasseb.fluxo.transaction.dto.CreateTransactionRequest;
import com.pedrocasseb.fluxo.transaction.dto.TransactionResponse;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

  private final TransactionRepository transactionRepository;
  private final CategoryRepository categoryRepository;

  public TransactionResponse create(CreateTransactionRequest request) {

    Category category =
        categoryRepository
            .findById(request.categoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

    FinancialTransaction transaction = new FinancialTransaction();

    transaction.setDescription(request.description());

    transaction.setAmount(request.amount());

    transaction.setTransactionDate(request.transactionDate());

    transaction.setCategory(category);

    FinancialTransaction saved = transactionRepository.save(transaction);

    return new TransactionResponse(
        saved.getId(),
        saved.getDescription(),
        saved.getAmount(),
        saved.getTransactionDate(),
        saved.getCategory().getId(),
        saved.getCategory().getName());
  }

  public List<TransactionResponse> findAll() {

    return transactionRepository.findAll().stream().map(this::toResponse).toList();
  }

  public void delete(UUID id) {
    if (!transactionRepository.existsById(id)) {
      throw new RuntimeException("Transaction not found");
    }
    transactionRepository.deleteById(id);
  }

  public TransactionResponse findById(UUID id) {
    FinancialTransaction transaction =
        transactionRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));

    return toResponse(transaction);
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
