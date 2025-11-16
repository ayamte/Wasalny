package com.wasalny.abonnement.repository;  
  
import com.wasalny.abonnement.entity.TypeAbonnement;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface TypeAbonnementRepository extends JpaRepository<TypeAbonnement, UUID> {  
    Optional<TypeAbonnement> findByCode(String code);  
    List<TypeAbonnement> findByActifTrue();  
    boolean existsByCode(String code);
  

}