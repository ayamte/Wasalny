package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.Station;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface StationRepository extends JpaRepository<Station, UUID> {  
    Optional<Station> findByNom(String nom);  
    List<Station> findByActiveTrue();  
}