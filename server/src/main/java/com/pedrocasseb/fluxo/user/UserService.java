package com.pedrocasseb.fluxo.user;

import com.pedrocasseb.fluxo.common.exception.BusinessException;
import com.pedrocasseb.fluxo.common.exception.EmailAlreadyExistsException;
import com.pedrocasseb.fluxo.common.exception.InvalidCredentialsException;
import com.pedrocasseb.fluxo.common.exception.UserNotFoundException;
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
        .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));
  }

  public UserResponse toResponse(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
  }

  public UserResponse updateProfile(User user, UpdateProfileRequest request) {
    if (request.name() != null) {
      if (request.name().trim().isEmpty()) {
        throw new BusinessException("O nome não pode ser vazio");
      }
      user.setName(request.name());
    }

    if (request.email() != null) {
      if (request.email().trim().isEmpty()) {
        throw new BusinessException("O e-mail não pode ser vazio");
      }
      if (!request.email().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
        throw new BusinessException("Formato de e-mail inválido");
      }
      if (!user.getEmail().equalsIgnoreCase(request.email()) && userRepository.existsByEmail(request.email())) {
        throw new EmailAlreadyExistsException("E-mail já cadastrado");
      }
      user.setEmail(request.email());
    }

    User saved = userRepository.save(user);
    return toResponse(saved);
  }

  public void changePassword(User user, ChangePasswordRequest request, PasswordEncoder passwordEncoder) {
    if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
      throw new InvalidCredentialsException("Senha atual incorreta");
    }

    if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
      throw new BusinessException("A nova senha não pode ser igual à senha atual");
    }

    user.setPassword(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);
  }

  public void deleteAccount(User user) {
    userRepository.delete(user);
  }
}
