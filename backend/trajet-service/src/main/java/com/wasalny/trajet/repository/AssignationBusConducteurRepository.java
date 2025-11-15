package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.AssignationBusConducteur;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.data.jpa.repository.Query;  
import org.springframework.data.repository.query.Param;  
import org.springframework.stereotype.Repository;  
  
import java.time.LocalDate;  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface AssignationBusConducteurRepository extends JpaRepository<AssignationBusConducteur, UUID> {  
    List<AssignationBusConducteur> findByBusIdAndActifTrue(UUID busId);  
      
    @Query("SELECT a FROM AssignationBusConducteur a WHERE a.bus.id = :busId AND a.actif = true AND :date BETWEEN a.dateDebut AND a.dateFin")  
    Optional<AssignationBusConducteur> findActiveAssignationForBusAtDate(@Param("busId") UUID busId, @Param("date") LocalDate date);  
}