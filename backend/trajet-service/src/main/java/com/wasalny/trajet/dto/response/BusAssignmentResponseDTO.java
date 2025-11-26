package com.wasalny.trajet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusAssignmentResponseDTO {

    private UUID id;
    private UUID busId;
    private String busImmatriculation;
    private UUID ligneId;
    private String ligneNumero;
    private UUID stationDepartId;
    private String stationDepartNom;
    private UUID stationArriveeId;
    private String stationArriveeNom;
    private LocalTime heureDepartAller;
    private LocalTime heureDepartRetour;
    private Boolean commenceAStationDepart;
    private Boolean active;
}