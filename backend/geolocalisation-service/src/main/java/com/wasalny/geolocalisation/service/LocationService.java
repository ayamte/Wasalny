package com.wasalny.geolocalisation.service;  
  
import com.wasalny.geolocalisation.entity.Location;  
import com.wasalny.geolocalisation.repository.LocationRepository;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Service;  
import java.util.List;  
  
@Service  
public class LocationService {  
    @Autowired  
    private LocationRepository locationRepository;  
      
    public Location saveLocation(Location location) {  
        return locationRepository.save(location);  
    }  
      
    public List<Location> getUserLocations(String userId) {  
        return locationRepository.findByUserIdOrderByCreatedAtDesc(userId);  
    }  
      
    public Location getLatestLocation(String userId) {  
        List<Location> locations = locationRepository.findByUserIdOrderByCreatedAtDesc(userId);  
        return locations.isEmpty() ? null : locations.get(0);  
    }  

    // Récupérer une location par ID  
public Location getLocationById(Long id) {  
    return locationRepository.findById(id)  
        .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));  
}  
  
// Mettre à jour une location  
public Location updateLocation(Long id, Location locationDetails) {  
    Location location = locationRepository.findById(id)  
        .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));  
      
    location.setLatitude(locationDetails.getLatitude());  
    location.setLongitude(locationDetails.getLongitude());  
    location.setUserId(locationDetails.getUserId());  
      
    return locationRepository.save(location);  
}  
  
// Supprimer une location  
public void deleteLocation(Long id) {  
    Location location = locationRepository.findById(id)  
        .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));  
    locationRepository.delete(location);  
}  
  
// Recherche géospatiale - locations à proximité  
// Cette méthode nécessite une requête personnalisée dans le repository  
public List<Location> getNearbyLocations(Double latitude, Double longitude, Double radiusKm) {  
    return locationRepository.findNearbyLocations(latitude, longitude, radiusKm);  
}
}