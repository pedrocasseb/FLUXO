package com.pedrocasseb.fluxo.goal;

import com.pedrocasseb.fluxo.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalRepository extends JpaRepository<Goal, UUID> {
  List<Goal> findByUser(User user);
  Optional<Goal> findByIdAndUser(UUID id, User user);
}
