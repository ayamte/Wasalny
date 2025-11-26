package com.wasalny.trajet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusAssignmentCreateDTO {

    @NotNull(message = "Bus ID is required")
    private UUID busId;

    @NotNull(message = "Ligne ID is required")
    private UUID ligneId;

    @NotNull(message = "Station Depart ID is required")
    private UUID stationDepartId;

    @NotNull(message = "Station Arrivee ID is required")
    private UUID stationArriveeId;

    @NotNull(message = "Heure Depart Aller is required")
    private LocalTime heureDepartAller;

    private LocalTime heureDepartRetour;

    /**
     * Indique si le bus commence son cycle à la station de départ (true)
     * ou à la station de destination (false)
     * Par défaut: true (station de départ)
     */
    private Boolean commenceAStationDepart = true;
}