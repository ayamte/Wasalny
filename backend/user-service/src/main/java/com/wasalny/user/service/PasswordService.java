package com.wasalny.user.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth-service")
public interface PasswordService {
    @PostMapping("/auth/change-password")
    void changePassword(
        @RequestParam String email,
        @RequestParam String currentPassword,
        @RequestParam String newPassword,
        @RequestParam String verificationCode
    );
}
