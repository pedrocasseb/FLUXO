package com.pedrocasseb.fluxo.transaction;

import com.pedrocasseb.fluxo.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<FinancialTransaction, UUID> {
  List<FinancialTransaction> findByUser(User user);
  Optional<FinancialTransaction> findByIdAndUser(UUID id, User user);
}
