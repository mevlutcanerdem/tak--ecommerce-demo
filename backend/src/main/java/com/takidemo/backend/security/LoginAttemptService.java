package com.takidemo.backend.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory brute-force guard for the login endpoint. Tracks failed attempts per
 * email (case-insensitive) and locks the account out for a fixed window after too many
 * consecutive failures. This is intentionally lightweight for a demo — a production system
 * would use a shared store (e.g. Redis) so limits hold across multiple app instances.
 */
@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_WINDOW_MS = 15 * 60 * 1000L; // 15 minutes

    private static final class Attempts {
        int count;
        Instant firstFailureAt;
        Instant lockedUntil;
    }

    private final ConcurrentHashMap<String, Attempts> attemptsByEmail = new ConcurrentHashMap<>();

    public void assertNotLocked(String email) {
        Attempts attempts = attemptsByEmail.get(normalize(email));
        if (attempts == null) {
            return;
        }
        synchronized (attempts) {
            if (attempts.lockedUntil != null && Instant.now().isBefore(attempts.lockedUntil)) {
                throw new AccountLockedException(
                        "Çok fazla başarısız giriş denemesi. Lütfen birkaç dakika sonra tekrar deneyin.");
            }
        }
    }

    public void onLoginFailed(String email) {
        String key = normalize(email);
        Attempts attempts = attemptsByEmail.computeIfAbsent(key, k -> new Attempts());
        synchronized (attempts) {
            Instant now = Instant.now();
            if (attempts.firstFailureAt == null
                    || now.isAfter(attempts.firstFailureAt.plusMillis(LOCKOUT_WINDOW_MS))) {
                attempts.count = 0;
                attempts.firstFailureAt = now;
                attempts.lockedUntil = null;
            }
            attempts.count++;
            if (attempts.count >= MAX_ATTEMPTS) {
                attempts.lockedUntil = now.plusMillis(LOCKOUT_WINDOW_MS);
            }
        }
    }

    public void onLoginSucceeded(String email) {
        attemptsByEmail.remove(normalize(email));
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
