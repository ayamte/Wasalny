package com.wasalny.geolocalisation.repository;    
    
import com.wasalny.geolocalisation.entity.Location;    
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.data.jpa.repository.Query;  
import org.springframework.data.repository.query.Param;  
import org.springframework.stereotype.Repository;    
import java.util.List;    
import java.util.Optional;  
    
@Repository    
public interface LocationRepository extends JpaRepository<Location, Long> {    
    List<Location> findByBusId(String busId);    
    List<Location> findByBusIdOrderByCreatedAtDesc(String busId);    
    Optional<Location> findFirstByBusIdOrderByCreatedAtDesc(String busId);  
      
    @Query(value = "SELECT * FROM locations l WHERE " +    
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(l.latitude)) * " +    
           "cos(radians(l.longitude) - radians(:longitude)) + " +    
           "sin(radians(:latitude)) * sin(radians(l.latitude)))) <= :radiusKm " +    
           "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(l.latitude)) * " +    
           "cos(radians(l.longitude) - radians(:longitude)) + " +    
           "sin(radians(:latitude)) * sin(radians(l.latitude))))",    
           nativeQuery = true)    
    List<Location> findNearbyLocations(    
        @Param("latitude") Double latitude,    
        @Param("longitude") Double longitude,    
        @Param("radiusKm") Double radiusKm    
    );    
}