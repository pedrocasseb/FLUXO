package com.pedrocasseb.fluxo.auth;

import com.pedrocasseb.fluxo.auth.dto.LoginRequest;
import com.pedrocasseb.fluxo.auth.dto.LoginResponse;
import com.pedrocasseb.fluxo.auth.dto.RegisterRequest;
import com.pedrocasseb.fluxo.auth.dto.RegisterResponse;
import com.pedrocasseb.fluxo.user.User;
import com.pedrocasseb.fluxo.user.UserRepository;
import com.pedrocasseb.fluxo.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final UserService userService;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public RegisterResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new RuntimeException("Email already registered");
    }

    User user = new User();
    user.setName(request.name());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));

    User saved = userRepository.save(user);

    return new RegisterResponse(
        saved.getId(),
        saved.getName(),
        saved.getEmail(),
        "User registered successfully"
    );
  }

  public LoginResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );

    User user = userService.findByEmail(request.email());
    String token = jwtService.generateToken(user.getEmail());

    return new LoginResponse(token, userService.toResponse(user));
  }
}
