package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.Bus;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface BusRepository extends JpaRepository<Bus, UUID> {  
      
    Optional<Bus> findByNumeroImmatriculation(String numeroImmatriculation);  
      
    // AJOUTER CETTE MÉTHODE  
    List<Bus> findByActiveTrue();  
}