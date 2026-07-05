package com.pedrocasseb.fluxo.goal;

import com.pedrocasseb.fluxo.category.Category;
import com.pedrocasseb.fluxo.category.CategoryRepository;
import com.pedrocasseb.fluxo.category.CategoryType;
import com.pedrocasseb.fluxo.common.exception.GoalContributionNotFoundException;
import com.pedrocasseb.fluxo.common.exception.GoalNotFoundException;
import com.pedrocasseb.fluxo.goal.dto.CreateContributionRequest;
import com.pedrocasseb.fluxo.goal.dto.CreateGoalRequest;
import com.pedrocasseb.fluxo.goal.dto.GoalContributionResponse;
import com.pedrocasseb.fluxo.goal.dto.GoalResponse;
import com.pedrocasseb.fluxo.goal.dto.UpdateGoalRequest;
import com.pedrocasseb.fluxo.transaction.FinancialTransaction;
import com.pedrocasseb.fluxo.transaction.TransactionRepository;
import com.pedrocasseb.fluxo.user.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GoalService {

  private static final String GOAL_CATEGORY_NAME = "Metas";

  private final GoalRepository goalRepository;
  private final GoalContributionRepository goalContributionRepository;
  private final CategoryRepository categoryRepository;
  private final TransactionRepository transactionRepository;

  public GoalResponse createGoal(CreateGoalRequest request, User user) {
    Goal goal = new Goal();
    goal.setName(request.name());
    goal.setTargetAmount(request.targetAmount());
    goal.setUser(user);

    Goal saved = goalRepository.save(goal);
    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public List<GoalResponse> findAll(User user) {
    return goalRepository.findByUser(user).stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public GoalResponse findById(UUID id, User user) {
    return toResponse(findGoal(id, user));
  }

  public GoalResponse updateGoal(UUID id, UpdateGoalRequest request, User user) {
    Goal goal = findGoal(id, user);

    if (request.name() != null) {
      goal.setName(request.name());
    }
    if (request.targetAmount() != null) {
      goal.setTargetAmount(request.targetAmount());
    }

    Goal saved = goalRepository.save(goal);
    return toResponse(saved);
  }

  public void delete(UUID id, User user) {
    Goal goal = findGoal(id, user);
    goalRepository.delete(goal);
  }

  @Transactional(readOnly = true)
  public List<GoalContributionResponse> listContributions(UUID goalId, User user) {
    Goal goal = findGoal(goalId, user);
    return goalContributionRepository.findByGoalOrderByContributionDateDesc(goal).stream()
        .map(this::toContributionResponse)
        .toList();
  }

  public GoalResponse addContribution(UUID goalId, CreateContributionRequest request, User user) {
    Goal goal = findGoal(goalId, user);

    FinancialTransaction transaction = new FinancialTransaction();
    transaction.setDescription("Aporte: " + goal.getName());
    transaction.setAmount(request.amount());
    transaction.setTransactionDate(request.contributionDate());
    transaction.setCategory(resolveGoalCategory(user));
    transaction.setUser(user);
    FinancialTransaction savedTransaction = transactionRepository.save(transaction);

    GoalContribution contribution = new GoalContribution();
    contribution.setAmount(request.amount());
    contribution.setContributionDate(request.contributionDate());
    contribution.setGoal(goal);
    contribution.setTransaction(savedTransaction);
    goalContributionRepository.save(contribution);

    return toResponse(findGoal(goalId, user));
  }

  public void deleteContribution(UUID goalId, UUID contributionId, User user) {
    Goal goal = findGoal(goalId, user);
    GoalContribution contribution =
        goalContributionRepository
            .findByIdAndGoal(contributionId, goal)
            .orElseThrow(() -> new GoalContributionNotFoundException("Aporte não encontrado"));
    goalContributionRepository.delete(contribution);
  }

  private Goal findGoal(UUID id, User user) {
    return goalRepository
        .findByIdAndUser(id, user)
        .orElseThrow(() -> new GoalNotFoundException("Meta não encontrada"));
  }

  private Category resolveGoalCategory(User user) {
    return categoryRepository
        .findByNameIgnoreCaseAndTypeAndUser(GOAL_CATEGORY_NAME, CategoryType.INVESTMENT, user)
        .orElseGet(() -> {
          Category category = new Category();
          category.setName(GOAL_CATEGORY_NAME);
          category.setType(CategoryType.INVESTMENT);
          category.setUser(user);
          return categoryRepository.save(category);
        });
  }

  private BigDecimal currentAmount(Goal goal) {
    return goalContributionRepository.findByGoalOrderByContributionDateDesc(goal).stream()
        .map(GoalContribution::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  private GoalResponse toResponse(Goal goal) {
    BigDecimal current = currentAmount(goal);
    return new GoalResponse(
        goal.getId(),
        goal.getName(),
        goal.getTargetAmount(),
        current,
        current.compareTo(goal.getTargetAmount()) >= 0,
        goal.getCreatedAt());
  }

  private GoalContributionResponse toContributionResponse(GoalContribution contribution) {
    return new GoalContributionResponse(
        contribution.getId(),
        contribution.getAmount(),
        contribution.getContributionDate(),
        contribution.getTransaction().getId(),
        contribution.getCreatedAt());
  }
}
