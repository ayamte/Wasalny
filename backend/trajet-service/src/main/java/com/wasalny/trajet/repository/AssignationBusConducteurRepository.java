package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.AssignationBusConducteur;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.data.jpa.repository.Query;  
import org.springframework.data.repository.query.Param;  
import org.springframework.stereotype.Repository;  
  
import java.time.LocalDate;  
import java.util.List;  
import java.util.UUID;  
  
@Repository  
public interface AssignationBusConducteurRepository extends JpaRepository<AssignationBusConducteur, UUID> {  
      
    // Méthodes existantes  
    @Query("SELECT a FROM AssignationBusConducteur a WHERE a.bus.id = :busId " +  
           "AND a.active = true " +  
           "AND ((a.dateDebut <= :dateDebut AND a.dateFin >= :dateDebut) " +  
           "OR (a.dateDebut <= :dateFin AND a.dateFin >= :dateFin) " +  
           "OR (a.dateDebut >= :dateDebut AND a.dateFin <= :dateFin))")  
    List<AssignationBusConducteur> findActiveAssignationForBusAtDate(  
        @Param("busId") UUID busId,  
        @Param("dateDebut") LocalDate dateDebut,  
        @Param("dateFin") LocalDate dateFin  
    );  
      
    List<AssignationBusConducteur> findByActiveTrue();  
      
    // NOUVELLES MÉTHODES À AJOUTER  
    List<AssignationBusConducteur> findByBusId(UUID busId);  
    List<AssignationBusConducteur> findByConducteurId(UUID conducteurId);  
}