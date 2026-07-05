package com.pedrocasseb.fluxo.subscription;

import com.pedrocasseb.fluxo.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
  List<Subscription> findByUser(User user);
  Optional<Subscription> findByIdAndUser(UUID id, User user);
}
