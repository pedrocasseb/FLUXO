package com.pedrocasseb.fluxo.transaction;

import com.pedrocasseb.fluxo.transaction.dto.CreateTransactionRequest;
import com.pedrocasseb.fluxo.transaction.dto.TransactionResponse;
import com.pedrocasseb.fluxo.transaction.dto.UpdateTransactionRequest;
import com.pedrocasseb.fluxo.user.User;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @RequestBody CreateTransactionRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(request, user));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> findAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                transactionService.findAll(user)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        transactionService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> findById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(transactionService.findById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTransactionRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(transactionService.update(id, request, user));
    }
}
