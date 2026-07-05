package com.pedrocasseb.fluxo.goal;

import com.pedrocasseb.fluxo.goal.dto.CreateContributionRequest;
import com.pedrocasseb.fluxo.goal.dto.CreateGoalRequest;
import com.pedrocasseb.fluxo.goal.dto.GoalContributionResponse;
import com.pedrocasseb.fluxo.goal.dto.GoalResponse;
import com.pedrocasseb.fluxo.goal.dto.UpdateGoalRequest;
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
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

  private final GoalService goalService;

  @PostMapping
  public ResponseEntity<GoalResponse> createGoal(
      @Valid @RequestBody CreateGoalRequest request,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.status(HttpStatus.CREATED).body(goalService.createGoal(request, user));
  }

  @GetMapping
  public ResponseEntity<List<GoalResponse>> getAllGoals(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(goalService.findAll(user));
  }

  @GetMapping("/{id}")
  public ResponseEntity<GoalResponse> findById(
      @PathVariable UUID id,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(goalService.findById(id, user));
  }

  @PutMapping("/{id}")
  public ResponseEntity<GoalResponse> updateGoal(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateGoalRequest request,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(goalService.updateGoal(id, request, user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteGoal(
      @PathVariable UUID id,
      @AuthenticationPrincipal User user
  ) {
    goalService.delete(id, user);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/contributions")
  public ResponseEntity<List<GoalContributionResponse>> listContributions(
      @PathVariable UUID id,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(goalService.listContributions(id, user));
  }

  @PostMapping("/{id}/contributions")
  public ResponseEntity<GoalResponse> addContribution(
      @PathVariable UUID id,
      @Valid @RequestBody CreateContributionRequest request,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(goalService.addContribution(id, request, user));
  }

  @DeleteMapping("/{id}/contributions/{contributionId}")
  public ResponseEntity<Void> deleteContribution(
      @PathVariable UUID id,
      @PathVariable UUID contributionId,
      @AuthenticationPrincipal User user
  ) {
    goalService.deleteContribution(id, contributionId, user);
    return ResponseEntity.noContent().build();
  }
}
