package com.pedrocasseb.fluxo.goal;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalContributionRepository extends JpaRepository<GoalContribution, UUID> {
  List<GoalContribution> findByGoalOrderByContributionDateDesc(Goal goal);
  Optional<GoalContribution> findByIdAndGoal(UUID id, Goal goal);
}
