package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.StatutTrip;  
import com.wasalny.trajet.entity.Trip;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.data.jpa.repository.Query;  
import org.springframework.data.repository.query.Param;  
import org.springframework.stereotype.Repository;  
  
import java.time.LocalDate;  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface TripRepository extends JpaRepository<Trip, UUID> {  
    Optional<Trip> findByNumeroTrip(String numeroTrip);  
    List<Trip> findByDateTripAndStatut(LocalDate dateTrip, StatutTrip statut);  
    List<Trip> findByBusIdAndDateTrip(UUID busId, LocalDate dateTrip);  
      
    @Query("SELECT t FROM Trip t WHERE t.ligne.id = :ligneId AND t.dateTrip = :date ORDER BY t.heureDepart")  
    List<Trip> findByLigneAndDate(@Param("ligneId") UUID ligneId, @Param("date") LocalDate date);  
}