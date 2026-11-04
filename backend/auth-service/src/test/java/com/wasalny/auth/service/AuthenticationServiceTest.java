package com.wasalny.auth.service;

import com.wasalny.auth.dto.RegisterUserDto;
import com.wasalny.auth.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock UserRepository repository;
    @Mock PasswordEncoder encoder;
    @Mock AuthenticationManager manager;
    @Mock EmailService emailService;
    @Mock UserProfileClient profiles;
    @InjectMocks AuthenticationService service;

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void publicSignupCannotCreateAnAdministrator() {
        RegisterUserDto input = new RegisterUserDto();
        input.setRole("ADMIN");

        assertThrows(AccessDeniedException.class, () -> service.signup(input));
        verifyNoInteractions(repository, encoder, emailService, profiles);
    }

    @Test
    void publicSignupCannotCreateADriver() {
        RegisterUserDto input = new RegisterUserDto();
        input.setRole("CONDUCTEUR");

        assertThrows(AccessDeniedException.class, () -> service.signup(input));
        verifyNoInteractions(repository, encoder, emailService, profiles);
    }
}
