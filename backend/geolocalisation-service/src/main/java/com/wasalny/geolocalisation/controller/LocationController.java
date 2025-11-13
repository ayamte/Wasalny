package com.wasalny.geolocalisation.controller;  
  
import com.wasalny.geolocalisation.entity.Location;  
import com.wasalny.geolocalisation.service.LocationService;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.http.ResponseEntity;  
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;  
  
import java.util.List;  
import jakarta.validation.Valid;
@Slf4j  
@RestController  
@RequestMapping("/locations")  
public class LocationController {  
      
    @Autowired  
    private LocationService locationService;  
      
   // @PostMapping  
   // public ResponseEntity<Location> createLocation(@RequestBody Location location) {  
    //    Location saved = locationService.saveLocation(location);  
      //  return ResponseEntity.ok(saved);  
   // }  
   @PostMapping  
    public ResponseEntity<Location> createLocation(@Valid @RequestBody Location location) {
        log.info("Creating location for user: {}", location.getUserId());
        Location saved = locationService.saveLocation(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }   
      
    @GetMapping  
    public ResponseEntity<List<Location>> getUserLocations(@RequestParam String userId) {  
        List<Location> locations = locationService.getUserLocations(userId);  
        return ResponseEntity.ok(locations);  
    }  
      
    @GetMapping("/latest")  
    public ResponseEntity<Location> getLatestLocation(@RequestParam String userId) {  
        Location location = locationService.getLatestLocation(userId);  
        return location != null ? ResponseEntity.ok(location) : ResponseEntity.notFound().build();  
    }  
}