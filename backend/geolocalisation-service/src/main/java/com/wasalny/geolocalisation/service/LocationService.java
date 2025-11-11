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
      
    public List<Location> getAllLocations() {  
        return locationRepository.findAll();  
    }  
      
    public List<Location> getLocationsByUserId(String userId) {  
        return locationRepository.findByUserId(userId);  
    }  
}
//hello