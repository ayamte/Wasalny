package com.wasalny.trajet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO simplifié pour assigner un bus à une ligne
 * Sans les complications des stations de départ/arrivée
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusLigneAssignmentDTO {

    @NotNull(message = "L'ID du bus est requis")
    private UUID busId;

    @NotNull(message = "L'ID de la ligne est requis")
    private UUID ligneId;

    /**
     * Active ou désactive l'assignation
     */
    private Boolean active = true;
}
