package com.wasalny.user.repository;

import com.wasalny.user.entity.ConducteurProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConducteurProfileRepository extends JpaRepository<ConducteurProfile, Long> {
    Optional<ConducteurProfile> findByEmail(String email);
    Optional<ConducteurProfile> findByNumeroPermis(String numeroPermis);
}
