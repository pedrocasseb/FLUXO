package com.pedrocasseb.fluxo.user;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.transaction.FinancialTransaction;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String name;

  @Column(unique = true)
  private String email;

  private String password;

  @CreationTimestamp private LocalDateTime createdAt;

  @UpdateTimestamp private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "user")
  private List<FinancialTransaction> transactions = new ArrayList<>();

  @OneToMany(mappedBy = "user")
  private List<Category> categories = new ArrayList<>();
}
