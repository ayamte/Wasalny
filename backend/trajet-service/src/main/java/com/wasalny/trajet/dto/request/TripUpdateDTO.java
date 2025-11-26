package com.wasalny.trajet.dto.request;

import com.wasalny.trajet.entity.StatutTrip;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripUpdateDTO {

    /**
     * Date du trip (optionnel - si null, ne sera pas modifié)
     */
    private LocalDate dateTrip;

    /**
     * Heure de départ (optionnel - si null, ne sera pas modifié)
     */
    private LocalTime heureDepart;

    /**
     * ID du bus assigné (optionnel - si null, ne sera pas modifié)
     */
    private UUID busId;

    /**
     * Statut du trip (optionnel - si null, ne sera pas modifié)
     */
    private StatutTrip statut;

    /**
     * Direction: true = aller, false = retour (optionnel - si null, ne sera pas modifié)
     */
    private Boolean estAller;
}
