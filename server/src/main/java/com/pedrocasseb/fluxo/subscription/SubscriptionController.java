package com.pedrocasseb.fluxo.subscription;

import com.pedrocasseb.fluxo.subscription.dto.CreateSubscriptionRequest;
import com.pedrocasseb.fluxo.subscription.dto.SubscriptionResponse;
import com.pedrocasseb.fluxo.subscription.dto.UpdateSubscriptionRequest;
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
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

  private final SubscriptionService subscriptionService;

  @PostMapping
  public ResponseEntity<SubscriptionResponse> createSubscription(
      @Valid @RequestBody CreateSubscriptionRequest request,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(subscriptionService.createSubscription(request, user));
  }

  @GetMapping
  public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(subscriptionService.findAll(user));
  }

  @GetMapping("/{id}")
  public ResponseEntity<SubscriptionResponse> findById(
      @PathVariable UUID id,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(subscriptionService.findById(id, user));
  }

  @PutMapping("/{id}")
  public ResponseEntity<SubscriptionResponse> updateSubscription(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateSubscriptionRequest request,
      @AuthenticationPrincipal User user
  ) {
    return ResponseEntity.ok(subscriptionService.updateSubscription(id, request, user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSubscription(
      @PathVariable UUID id,
      @AuthenticationPrincipal User user
  ) {
    subscriptionService.delete(id, user);
    return ResponseEntity.noContent().build();
  }
}
