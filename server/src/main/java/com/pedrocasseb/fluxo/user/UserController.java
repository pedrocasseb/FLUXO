package com.pedrocasseb.fluxo.user;

import com.pedrocasseb.fluxo.user.dto.ChangePasswordRequest;
import com.pedrocasseb.fluxo.user.dto.UpdateProfileRequest;
import com.pedrocasseb.fluxo.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final PasswordEncoder passwordEncoder;

  @GetMapping("/me")
  public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(userService.toResponse(user));
  }

  @PutMapping("/me")
  public ResponseEntity<UserResponse> updateProfile(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody UpdateProfileRequest request
  ) {
    return ResponseEntity.ok(userService.updateProfile(user, request));
  }

  @PutMapping("/me/password")
  public ResponseEntity<Void> changePassword(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody ChangePasswordRequest request
  ) {
    userService.changePassword(user, request, passwordEncoder);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/me")
  public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal User user) {
    userService.deleteAccount(user);
    return ResponseEntity.noContent().build();
  }
}
