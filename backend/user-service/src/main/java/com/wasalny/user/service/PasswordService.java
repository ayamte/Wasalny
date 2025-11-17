package com.wasalny.user.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

// TEMPORAIREMENT DÉSACTIVÉ pour résoudre le problème de timeout
// Réactivez après avoir configuré les timeouts Feign
//@FeignClient(name = "auth-service")
public interface PasswordService {
    //@PostMapping("/auth/change-password")
    default void changePassword(
        String email,
        String currentPassword,
        String newPassword,
        String verificationCode
    ) {
        throw new UnsupportedOperationException("PasswordService temporairement désactivé. Utilisez auth-service directement.");
    }
}
