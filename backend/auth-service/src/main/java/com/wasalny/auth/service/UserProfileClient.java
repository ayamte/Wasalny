package com.wasalny.auth.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service")
public interface UserProfileClient {
    @PostMapping("/users/admin/users/create")
    ResponseEntity<?> createProfile(
        @RequestParam("uuid") String uuid,
        @RequestParam("email") String email,
        @RequestParam("username") String username,
        @RequestParam("role") String role,
        @RequestParam("dateCreation") String dateCreation,
        @RequestParam(value = "nom", required = false) String nom,
        @RequestParam(value = "prenom", required = false) String prenom,
        @RequestParam(value = "telephone", required = false) String telephone,
        @RequestParam(value = "numeroPermis", required = false) String numeroPermis
    );

    @GetMapping("/api/users/{userId}")
    ResponseEntity<?> getUserProfile(@PathVariable("userId") String userId);
}
