package com.wasalny.user.config;

import com.wasalny.user.service.UserProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("profileAccess")
public class ProfileAccess {
    private final UserProfileService profiles;

    public ProfileAccess(UserProfileService profiles) {
        this.profiles = profiles;
    }

    public boolean canAccess(String userId, Authentication authentication) {
        if (authentication == null) return false;
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }
        try {
            return authentication.getName().equals(profiles.getUserByUuid(UUID.fromString(userId)).getEmail());
        } catch (RuntimeException exception) {
            return false;
        }
    }
}
