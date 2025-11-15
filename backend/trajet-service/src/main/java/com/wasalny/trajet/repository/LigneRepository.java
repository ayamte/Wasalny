package com.wasalny.trajet.repository;  
  
import com.wasalny.trajet.entity.Ligne;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface LigneRepository extends JpaRepository<Ligne, UUID> {  
    Optional<Ligne> findByNumero(String numero);  
    List<Ligne> findByActiveTrue();  
}