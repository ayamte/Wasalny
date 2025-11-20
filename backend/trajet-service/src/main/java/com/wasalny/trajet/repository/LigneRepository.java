package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.Ligne;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface LigneRepository extends JpaRepository<Ligne, UUID> {  
      
    /**  
     * Trouver une ligne par son numéro  
     */  
    Optional<Ligne> findByNumero(String numero);  
      
    /**  
     * Vérifier si une ligne existe avec ce numéro  
     */  
    boolean existsByNumero(String numero);  
      
    /**  
     * Lister toutes les lignes actives  
     */  
    List<Ligne> findByActiveTrue();  
      
    /**  
     * Lister toutes les lignes (actives et inactives)  
     */  
    List<Ligne> findAll();  
}