package com.pedrocasseb.fluxo.common;

import com.pedrocasseb.fluxo.common.dto.ErrorResponse;
import com.pedrocasseb.fluxo.common.exception.BusinessException;
import com.pedrocasseb.fluxo.common.exception.ForbiddenException;
import com.pedrocasseb.fluxo.common.exception.InvalidCredentialsException;
import com.pedrocasseb.fluxo.common.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(
      MethodArgumentNotValidException ex,
      HttpServletRequest request
  ) {
    Map<String, String> fields = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      fields.put(fieldName, errorMessage);
    });

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.BAD_REQUEST.value(),
        "Validation Error",
        "Dados inválidos",
        request.getRequestURI(),
        fields
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
      ResourceNotFoundException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.NOT_FOUND.value(),
        "Not Found",
        ex.getMessage(),
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<ErrorResponse> handleForbiddenException(
      ForbiddenException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.FORBIDDEN.value(),
        "Forbidden",
        ex.getMessage(),
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDeniedException(
      AccessDeniedException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.FORBIDDEN.value(),
        "Forbidden",
        "Você não possui permissão para acessar este recurso",
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(
      InvalidCredentialsException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.UNAUTHORIZED.value(),
        "Unauthorized",
        ex.getMessage(),
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentialsException(
      BadCredentialsException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.UNAUTHORIZED.value(),
        "Unauthorized",
        "E-mail ou senha inválidos",
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
      HttpMessageNotReadableException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        "Dados inválidos",
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
      DataIntegrityViolationException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.CONFLICT.value(),
        "Conflict",
        "Este registro está em uso por outro recurso e não pode ser excluído",
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ErrorResponse> handleBusinessException(
      BusinessException ex,
      HttpServletRequest request
  ) {
    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.CONFLICT.value(),
        "Conflict",
        ex.getMessage(),
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleAllExceptions(
      Exception ex,
      HttpServletRequest request
  ) {
    log.error("Unexpected error occurred", ex);

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "Internal Server Error",
        "Ocorreu um erro inesperado",
        request.getRequestURI(),
        null
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }
}
