package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.request.LocationDTO;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.stereotype.Service;  
import org.springframework.web.reactive.function.client.WebClient;  
import java.util.UUID;  
  
@Service  
@RequiredArgsConstructor  
@Slf4j  
public class GeolocationClientService {  
      
    private final WebClient.Builder webClientBuilder;  
      
    public void updateBusLocation(UUID busId, Double latitude, Double longitude) {  
        try {  
            webClientBuilder.build()  
                .post()  
                .uri("http://geolocalisation-service/locations")  
                .bodyValue(new LocationDTO(busId, latitude, longitude))  
                .retrieve()  
                .bodyToMono(Void.class)  
                .block();  
              
            log.info("Position du bus {} mise à jour: lat={}, lon={}", busId, latitude, longitude);  
        } catch (Exception e) {  
            log.error("Erreur lors de la mise à jour de la position du bus {}: {}", busId, e.getMessage());  
        }  
    }  
}