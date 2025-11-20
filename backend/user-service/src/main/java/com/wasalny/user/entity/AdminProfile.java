package com.wasalny.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_profiles")
public class AdminProfile extends UserProfile {
    // Admin hérite uniquement de UserProfile
}
