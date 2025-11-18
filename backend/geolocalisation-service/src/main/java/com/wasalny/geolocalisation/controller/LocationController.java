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
        
    @PostMapping    
    public ResponseEntity<Location> createLocation(@Valid @RequestBody Location location) {  
        log.info("Creating location for bus: {}", location.getBusId());  
        Location saved = locationService.saveLocation(location);  
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);  
    }     
        
    @GetMapping    
    public ResponseEntity<List<Location>> getBusLocations(@RequestParam String busId) {    
        List<Location> locations = locationService.getBusLocations(busId);    
        return ResponseEntity.ok(locations);    
    }    
        
    @GetMapping("/latest")    
    public ResponseEntity<Location> getLatestLocation(@RequestParam String busId) {    
        Location location = locationService.getLatestLocation(busId);    
        return location != null ? ResponseEntity.ok(location) : ResponseEntity.notFound().build();    
    }    
      
    @GetMapping("/{busId}")    
    public ResponseEntity<Location> getLocationByBusId(@PathVariable String busId) {    
        Location location = locationService.getLatestLocation(busId);    
        return location != null ? ResponseEntity.ok(location) : ResponseEntity.notFound().build();    
    }    
      
    @GetMapping("/id/{id}")    
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {    
        try {    
            Location location = locationService.getLocationById(id);    
            return ResponseEntity.ok(location);    
        } catch (RuntimeException e) {    
            return ResponseEntity.notFound().build();    
        }    
    }    
    
    @PutMapping("/{id}")    
    public ResponseEntity<Location> updateLocation(    
            @PathVariable Long id,    
            @Valid @RequestBody Location locationDetails) {    
        try {    
            Location updatedLocation = locationService.updateLocation(id, locationDetails);    
            return ResponseEntity.ok(updatedLocation);    
        } catch (RuntimeException e) {    
            return ResponseEntity.notFound().build();    
        }    
    }    
    
    @DeleteMapping("/{id}")    
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {    
        try {    
            locationService.deleteLocation(id);    
            return ResponseEntity.noContent().build();    
        } catch (RuntimeException e) {    
            return ResponseEntity.notFound().build();    
        }    
    }    
    
    @GetMapping("/nearby")    
    public ResponseEntity<List<Location>> getNearbyLocations(    
            @RequestParam Double latitude,    
            @RequestParam Double longitude,    
            @RequestParam(defaultValue = "5.0") Double radiusKm) {    
        List<Location> locations = locationService.getNearbyLocations(latitude, longitude, radiusKm);    
        return ResponseEntity.ok(locations);    
    }  
}