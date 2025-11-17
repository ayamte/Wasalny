package com.wasalny.abonnement.repository;  
  
import com.wasalny.abonnement.entity.Abonnement;  
import com.wasalny.abonnement.entity.StatutAbonnement;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
import java.time.LocalDate;  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface AbonnementRepository extends JpaRepository<Abonnement, UUID> {  
    Optional<Abonnement> findByNumeroAbonnement(String numeroAbonnement);  
    List<Abonnement> findByClientId(UUID clientId);  
    List<Abonnement> findByClientIdAndStatut(UUID clientId, StatutAbonnement statut);  
    List<Abonnement> findByStatutAndDateFinBefore(StatutAbonnement statut, LocalDate date);  
    List<Abonnement> findByClientIdOrderByDateAchatDesc(UUID clientId); 
    List<Abonnement> findByStatut(StatutAbonnement statut);  


}