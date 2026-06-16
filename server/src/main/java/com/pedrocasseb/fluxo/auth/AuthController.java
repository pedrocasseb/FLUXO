package com.pedrocasseb.fluxo.auth;

import com.pedrocasseb.fluxo.auth.dto.LoginRequest;
import com.pedrocasseb.fluxo.auth.dto.LoginResponse;
import com.pedrocasseb.fluxo.auth.dto.RegisterRequest;
import com.pedrocasseb.fluxo.auth.dto.RegisterResponse;
import com.pedrocasseb.fluxo.user.User;
import com.pedrocasseb.fluxo.user.UserService;
import com.pedrocasseb.fluxo.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final UserService userService;

  @PostMapping("/register")
  public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User user) {
    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    return ResponseEntity.ok(userService.toResponse(user));
  }
}
