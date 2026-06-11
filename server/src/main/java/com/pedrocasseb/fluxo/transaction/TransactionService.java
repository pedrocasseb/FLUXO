package com.pedrocasseb.fluxo.transaction;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.category.CategoryRepository;
import com.pedrocasseb.fluxo.transaction.dto.CreateTransactionRequest;
import com.pedrocasseb.fluxo.transaction.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionResponse create(
            CreateTransactionRequest request
    ) {

        Category category = categoryRepository.findById(
                request.categoryId()
        ).orElseThrow(() ->
                new RuntimeException("Category not found")
        );

        FinancialTransaction transaction =
                new FinancialTransaction();

        transaction.setDescription(
                request.description()
        );

        transaction.setAmount(
                request.amount()
        );

        transaction.setTransactionDate(
                request.transactionDate()
        );

        transaction.setCategory(category);

        FinancialTransaction saved =
                transactionRepository.save(transaction);

        return new TransactionResponse(
                saved.getId(),
                saved.getDescription(),
                saved.getAmount(),
                saved.getTransactionDate(),
                saved.getCategory().getId(),
                saved.getCategory().getName()
        );
    }

    public List<TransactionResponse> findAll() {

        return transactionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TransactionResponse toResponse(
            FinancialTransaction transaction
    ) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getTransactionDate(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName()
        );
    }
}
