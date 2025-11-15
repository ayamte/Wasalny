package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.ConfigurationHoraire;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface ConfigurationHoraireRepository extends JpaRepository<ConfigurationHoraire, UUID> {  
    Optional<ConfigurationHoraire> findByLigneIdAndActifTrue(UUID ligneId);  
}