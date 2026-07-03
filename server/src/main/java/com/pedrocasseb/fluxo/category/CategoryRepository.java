package com.pedrocasseb.fluxo.category;

import com.pedrocasseb.fluxo.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
  List<Category> findByUser(User user);
  Optional<Category> findByIdAndUser(UUID id, User user);
  Optional<Category> findByNameIgnoreCaseAndUser(String name, User user);
  Optional<Category> findByNameIgnoreCaseAndTypeAndUser(String name, CategoryType type, User user);
}
