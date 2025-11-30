package com.wasalny.geolocalisation.service;

import com.wasalny.geolocalisation.entity.Location;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast bus location update to all subscribers
     * @param location The updated location
     */
    public void broadcastLocationUpdate(Location location) {
        try {
            String destination = "/topic/bus/" + location.getBusId() + "/location";
            messagingTemplate.convertAndSend(destination, location);
            log.info("Broadcasted location update for bus {} to {}", location.getBusId(), destination);
        } catch (Exception e) {
            log.error("Error broadcasting location update for bus {}: {}", location.getBusId(), e.getMessage());
        }
    }
}
