package com.pedrocasseb.fluxo.common.exception;

public class CategoryNotFoundException extends ResourceNotFoundException {
  public CategoryNotFoundException(String message) {
    super(message);
  }
}
