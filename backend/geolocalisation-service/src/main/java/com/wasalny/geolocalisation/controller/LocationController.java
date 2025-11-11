package com.wasalny.geolocalisation.controller;  
  
import com.wasalny.geolocalisation.entity.Location;  
import com.wasalny.geolocalisation.service.LocationService;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.*;  
  
import java.util.List;  
  
@RestController  
@RequestMapping("/locations")  
public class LocationController {  
    @Autowired  
    private LocationService locationService;  
      
    @PostMapping  
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {  
        Location savedLocation = locationService.saveLocation(location);  
        return ResponseEntity.ok(savedLocation);
    }  
      
    @GetMapping  
    public ResponseEntity<List<Location>> getAllLocations() {  
        return ResponseEntity.ok(locationService.getAllLocations());  
    }  
      
    @GetMapping("/user/{userId}")  
    public ResponseEntity<List<Location>> getLocationsByUserId(@PathVariable String userId) {  
        return ResponseEntity.ok(locationService.getLocationsByUserId(userId));  
    }  
}