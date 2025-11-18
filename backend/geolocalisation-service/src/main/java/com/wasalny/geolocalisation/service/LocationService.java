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
        
    public List<Location> getBusLocations(String busId) {    
        return locationRepository.findByBusIdOrderByCreatedAtDesc(busId);    
    }    
        
    public Location getLatestLocation(String busId) {    
        return locationRepository.findFirstByBusIdOrderByCreatedAtDesc(busId)  
            .orElse(null);  
    }    
  
    public Location getLocationById(Long id) {    
        return locationRepository.findById(id)    
            .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));    
    }    
    
    public Location updateLocation(Long id, Location locationDetails) {    
        Location location = locationRepository.findById(id)    
            .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));    
            
        location.setLatitude(locationDetails.getLatitude());    
        location.setLongitude(locationDetails.getLongitude());    
        location.setBusId(locationDetails.getBusId());    
            
        return locationRepository.save(location);    
    }    
    
    public void deleteLocation(Long id) {    
        Location location = locationRepository.findById(id)    
            .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));    
        locationRepository.delete(location);    
    }    
    
    public List<Location> getNearbyLocations(Double latitude, Double longitude, Double radiusKm) {    
        return locationRepository.findNearbyLocations(latitude, longitude, radiusKm);    
    }  
}