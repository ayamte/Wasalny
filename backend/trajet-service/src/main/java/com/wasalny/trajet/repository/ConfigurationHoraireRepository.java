package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.ConfigurationHoraire;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
  
import java.util.List;  
import java.util.UUID;  
  
@Repository  
public interface ConfigurationHoraireRepository extends JpaRepository<ConfigurationHoraire, UUID> {  
      
    List<ConfigurationHoraire> findByLigneId(UUID ligneId);  
    List<ConfigurationHoraire> findByActiveTrue();  // ✅ Ajouté  
}