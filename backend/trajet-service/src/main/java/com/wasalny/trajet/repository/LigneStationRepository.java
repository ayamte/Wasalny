package com.wasalny.trajet.repository;  

import com.wasalny.trajet.entity.Ligne; 
import com.wasalny.trajet.entity.LigneStation;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
  
import java.util.List;  
import java.util.UUID;  
  
@Repository  
public interface LigneStationRepository extends JpaRepository<LigneStation, UUID> {  
    List<LigneStation> findByLigneIdOrderByOrdreAsc(UUID ligneId);  
    List<LigneStation> findByLigneOrderByOrdreAsc(Ligne ligne);
}