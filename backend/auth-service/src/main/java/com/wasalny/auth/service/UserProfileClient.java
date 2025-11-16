package com.wasalny.auth.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service")
public interface UserProfileClient {
    @PostMapping("/admin/users/create")
    ResponseEntity<?> createProfile(
        @RequestParam("email") String email,
        @RequestParam("username") String username,
        @RequestParam("role") String role,
        @RequestParam("dateCreation") String dateCreation
    );
}
