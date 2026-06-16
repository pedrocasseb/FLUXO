package com.pedrocasseb.fluxo.user;

import com.pedrocasseb.fluxo.user.dto.ChangePasswordRequest;
import com.pedrocasseb.fluxo.user.dto.UpdateProfileRequest;
import com.pedrocasseb.fluxo.user.dto.UserResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public User findByEmail(String email) {
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
  }

  public User findById(UUID id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public UserResponse toResponse(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
  }

  public UserResponse updateProfile(User user, UpdateProfileRequest request) {
    if (request.name() != null) {
      if (request.name().trim().isEmpty()) {
        throw new RuntimeException("Name cannot be empty");
      }
      user.setName(request.name());
    }

    if (request.email() != null) {
      if (request.email().trim().isEmpty()) {
        throw new RuntimeException("Email cannot be empty");
      }
      if (!request.email().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
        throw new RuntimeException("Email is invalid");
      }
      if (!user.getEmail().equalsIgnoreCase(request.email()) && userRepository.existsByEmail(request.email())) {
        throw new RuntimeException("Email is already in use");
      }
      user.setEmail(request.email());
    }

    User saved = userRepository.save(user);
    return toResponse(saved);
  }

  public void changePassword(User user, ChangePasswordRequest request, PasswordEncoder passwordEncoder) {
    if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
      throw new RuntimeException("Current password is incorrect");
    }

    if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
      throw new RuntimeException("New password cannot be the same as current password");
    }

    user.setPassword(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);
  }

  public void deleteAccount(User user) {
    userRepository.delete(user);
  }
}
