package com.wasalny.trajet.service;

import com.wasalny.trajet.dto.request.BusAssignmentCreateDTO;
import com.wasalny.trajet.dto.response.BusAssignmentResponseDTO;
import com.wasalny.trajet.entity.Bus;
import com.wasalny.trajet.entity.BusAssignment;
import com.wasalny.trajet.entity.Ligne;
import com.wasalny.trajet.entity.Station;
import com.wasalny.trajet.repository.BusAssignmentRepository;
import com.wasalny.trajet.repository.BusRepository;
import com.wasalny.trajet.repository.LigneRepository;
import com.wasalny.trajet.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BusAssignmentService {

    private final BusAssignmentRepository busAssignmentRepository;
    private final BusRepository busRepository;
    private final LigneRepository ligneRepository;
    private final StationRepository stationRepository;

    public BusAssignmentResponseDTO assignerBus(BusAssignmentCreateDTO dto) {
        // Vérifications
        Bus bus = busRepository.findById(dto.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus non trouvé: " + dto.getBusId()));

        Ligne ligne = ligneRepository.findById(dto.getLigneId())
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée: " + dto.getLigneId()));

        Station stationDepart = stationRepository.findById(dto.getStationDepartId())
                .orElseThrow(() -> new RuntimeException("Station de départ non trouvée: " + dto.getStationDepartId()));

        Station stationArrivee = stationRepository.findById(dto.getStationArriveeId())
                .orElseThrow(() -> new RuntimeException("Station d'arrivée non trouvée: " + dto.getStationArriveeId()));

        // Vérifier que les stations appartiennent à la ligne
        boolean departInLigne = ligne.getLigneStations().stream()
                .anyMatch(ls -> ls.getStation().getId().equals(dto.getStationDepartId()));
        boolean arriveeInLigne = ligne.getLigneStations().stream()
                .anyMatch(ls -> ls.getStation().getId().equals(dto.getStationArriveeId()));
        if (!departInLigne || !arriveeInLigne) {
            throw new RuntimeException("Les stations de départ et d'arrivée doivent appartenir à la ligne");
        }

        // Vérifier unicité
        if (busAssignmentRepository.existsByBusIdAndLigneIdAndStationDepartIdAndStationArriveeIdAndActiveTrue(
                dto.getBusId(), dto.getLigneId(), dto.getStationDepartId(), dto.getStationArriveeId())) {
            throw new RuntimeException("Ce bus est déjà assigné à cette ligne avec ces stations");
        }

        // Créer l'assignation
        BusAssignment assignment = new BusAssignment();
        assignment.setBus(bus);
        assignment.setLigne(ligne);
        assignment.setStationDepart(stationDepart);
        assignment.setStationArrivee(stationArrivee);
        assignment.setHeureDepartAller(dto.getHeureDepartAller());
        assignment.setHeureDepartRetour(dto.getHeureDepartRetour());
        assignment.setActive(true);

        BusAssignment saved = busAssignmentRepository.save(assignment);
        return convertToResponseDTO(saved);
    }

    public List<BusAssignmentResponseDTO> obtenirAssignmentsParLigne(UUID ligneId) {
        return busAssignmentRepository.findByLigneIdAndActiveTrue(ligneId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public void desactiverAssignment(UUID assignmentId) {
        BusAssignment assignment = busAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignation non trouvée: " + assignmentId));
        assignment.setActive(false);
        busAssignmentRepository.save(assignment);
    }

    private BusAssignmentResponseDTO convertToResponseDTO(BusAssignment assignment) {
        BusAssignmentResponseDTO dto = new BusAssignmentResponseDTO();
        dto.setId(assignment.getId());
        dto.setBusId(assignment.getBus().getId());
        dto.setBusImmatriculation(assignment.getBus().getNumeroImmatriculation());
        dto.setLigneId(assignment.getLigne().getId());
        dto.setLigneNumero(assignment.getLigne().getNumero());
        dto.setStationDepartId(assignment.getStationDepart().getId());
        dto.setStationDepartNom(assignment.getStationDepart().getNom());
        dto.setStationArriveeId(assignment.getStationArrivee().getId());
        dto.setStationArriveeNom(assignment.getStationArrivee().getNom());
        dto.setHeureDepartAller(assignment.getHeureDepartAller());
        dto.setHeureDepartRetour(assignment.getHeureDepartRetour());
        dto.setActive(assignment.getActive());
        return dto;
    }
}