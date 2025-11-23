package com.wasalny.trajet.repository;

import com.wasalny.trajet.entity.BusAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BusAssignmentRepository extends JpaRepository<BusAssignment, UUID> {

    List<BusAssignment> findByLigneIdAndActiveTrue(UUID ligneId);

    List<BusAssignment> findByBusIdAndActiveTrue(UUID busId);

    boolean existsByBusIdAndLigneIdAndStationDepartIdAndStationArriveeIdAndActiveTrue(UUID busId, UUID ligneId, UUID stationDepartId, UUID stationArriveeId);
}