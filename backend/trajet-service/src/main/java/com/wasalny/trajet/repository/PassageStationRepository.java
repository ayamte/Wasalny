package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.PassageStation;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.data.jpa.repository.Query;  
import org.springframework.data.repository.query.Param;  
import org.springframework.stereotype.Repository;  
  
import java.util.List;  
import java.util.UUID;  
  
@Repository  
public interface PassageStationRepository extends JpaRepository<PassageStation, UUID> {  
    List<PassageStation> findByTripIdOrderByOrdreAsc(UUID tripId);  
      
    @Query("SELECT ps FROM PassageStation ps WHERE ps.trip.id = :tripId AND ps.confirme = false ORDER BY ps.ordre")  
    List<PassageStation> findNonConfirmesByTrip(@Param("tripId") UUID tripId);  
}