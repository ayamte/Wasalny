package com.wasalny.auth.service;  
  
import com.wasalny.auth.dto.LoginUserDto;  
import com.wasalny.auth.dto.RegisterUserDto;  
import com.wasalny.auth.dto.VerifyUserDto;  
import com.wasalny.auth.entity.RoleUtilisateur;  
import com.wasalny.auth.entity.User;  
import com.wasalny.auth.repository.UserRepository;  
import org.springframework.security.authentication.AuthenticationManager;  
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;  
import org.springframework.security.crypto.password.PasswordEncoder;  
import org.springframework.stereotype.Service;  
  
import java.time.LocalDateTime;  
  
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final UserProfileClient userProfileClient;

    public AuthenticationService(
        UserRepository userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder,
        EmailService emailService,
        UserProfileClient userProfileClient
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.userProfileClient = userProfileClient;
    }  
  
    public User signup(RegisterUserDto input) {
        // Validation du rôle
        if (input.getRole() == null || input.getRole().isBlank()) {
            throw new IllegalArgumentException("Role cannot be empty");
        }

        try {
            RoleUtilisateur role = RoleUtilisateur.valueOf(input.getRole().toUpperCase());

            LocalDateTime dateCreation = LocalDateTime.now();

            User user = new User(input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
            user.setRole(role);
            user.setDateCreation(dateCreation);
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
            user.setEnabled(false);
            sendVerificationEmail(user);

            User savedUser = userRepository.save(user);

            // Appeler user-service pour créer le profil
            try {
                userProfileClient.createProfile(
                    savedUser.getEmail(),
                    savedUser.getUsername(),
                    savedUser.getRole().name(),
                    dateCreation.toString()
                );
            } catch (Exception e) {
                // Log l'erreur mais ne bloque pas l'inscription
                System.err.println("Error creating user profile: " + e.getMessage());
            }

            return savedUser;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + input.getRole() + ". Must be ADMIN, CONDUCTEUR, or CLIENT");
        }
    }  
  
    public User authenticate(LoginUserDto input) {  
        User user = userRepository.findByEmail(input.getEmail())  
                .orElseThrow(() -> new RuntimeException("User not found"));  
  
        if (!user.isEnabled()) {  
            throw new RuntimeException("Account not verified. Please verify your email.");  
        }  
  
        authenticationManager.authenticate(  
                new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword())  
        );  
  
        return user;  
    }  
  
    public void verifyUser(VerifyUserDto input) {  
        User user = userRepository.findByEmail(input.getEmail())  
                .orElseThrow(() -> new RuntimeException("User not found"));  
  
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {  
            throw new RuntimeException("Verification code has expired");  
        }  
  
        if (user.getVerificationCode().equals(input.getVerificationCode())) {  
            user.setEnabled(true);  
            user.setVerificationCode(null);  
            user.setVerificationCodeExpiresAt(null);  
            userRepository.save(user);  
        } else {  
            throw new RuntimeException("Invalid verification code");  
        }  
    }  
  
    public void resendVerificationCode(String email) {  
        User user = userRepository.findByEmail(email)  
                .orElseThrow(() -> new RuntimeException("User not found"));  
  
        if (user.isEnabled()) {  
            throw new RuntimeException("Account is already verified");  
        }  
  
        user.setVerificationCode(generateVerificationCode());  
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));  
        sendVerificationEmail(user);  
        userRepository.save(user);  
    }  
  
    private void sendVerificationEmail(User user) {  
        String subject = "Account Verification";  
        String verificationCode = user.getVerificationCode();  
        String htmlMessage = "<html>"  
                + "<body style=\"font-family: Arial, sans-serif;\">"  
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"  
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"  
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"  
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"  
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"  
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"  
                + "</div>"  
                + "</div>"  
                + "</body>"  
                + "</html>";  
  
        try {  
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
  
    private String generateVerificationCode() {  
        return String.valueOf((int) ((Math.random() * (999999 - 100000)) + 100000));  
    }  
}