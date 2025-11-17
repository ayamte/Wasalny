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
    // GET /locations/{id} - Récupérer une location par ID  
@GetMapping("/{id}")  
public ResponseEntity<Location> getLocationById(@PathVariable Long id) {  
    try {  
        Location location = locationService.getLocationById(id);  
        return ResponseEntity.ok(location);  
    } catch (RuntimeException e) {  
        return ResponseEntity.notFound().build();  
    }  
}  
  
// PUT /locations/{id} - Mettre à jour une location  
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
  
// DELETE /locations/{id} - Supprimer une location  
@DeleteMapping("/{id}")  
public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {  
    try {  
        locationService.deleteLocation(id);  
        return ResponseEntity.noContent().build();  
    } catch (RuntimeException e) {  
        return ResponseEntity.notFound().build();  
    }  
}  
  
// GET /locations/nearby - Recherche géospatiale  
@GetMapping("/nearby")  
public ResponseEntity<List<Location>> getNearbyLocations(  
        @RequestParam Double latitude,  
        @RequestParam Double longitude,  
        @RequestParam(defaultValue = "5.0") Double radiusKm) {  
    List<Location> locations = locationService.getNearbyLocations(latitude, longitude, radiusKm);  
    return ResponseEntity.ok(locations);  
}
}