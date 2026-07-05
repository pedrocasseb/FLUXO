package com.pedrocasseb.fluxo.subscription;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.transaction.PaymentMethod;
import com.pedrocasseb.fluxo.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String name;

  private BigDecimal amount;

  private Integer dueDay;

  @Enumerated(EnumType.STRING)
  private PaymentMethod paymentMethod;

  private LocalDate nextDueDate;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @CreationTimestamp private LocalDateTime createdAt;
}
