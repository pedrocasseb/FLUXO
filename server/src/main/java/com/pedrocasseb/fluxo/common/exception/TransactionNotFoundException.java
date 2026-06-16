package com.pedrocasseb.fluxo.common.exception;

public class TransactionNotFoundException extends ResourceNotFoundException {
  public TransactionNotFoundException(String message) {
    super(message);
  }
}
