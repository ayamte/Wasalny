package com.wasalny.user.repository;

import com.wasalny.user.entity.RoleUtilisateur;
import com.wasalny.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);
    List<UserProfile> findByRole(RoleUtilisateur role);
    boolean existsByEmail(String email);
}
