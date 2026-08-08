package com.takidemo.backend.security;

/**
 * Thrown when a login is attempted while the account is temporarily locked out due to too
 * many recent failed attempts. Mapped to HTTP 429 (Too Many Requests) by the global exception
 * handler.
 */
public class AccountLockedException extends RuntimeException {
    public AccountLockedException(String message) {
        super(message);
    }
}
