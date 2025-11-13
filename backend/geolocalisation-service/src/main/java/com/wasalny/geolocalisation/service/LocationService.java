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
}