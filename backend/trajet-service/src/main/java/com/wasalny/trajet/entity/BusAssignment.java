package com.wasalny.trajet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "bus_assignment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusAssignment {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ligne_id", nullable = false)
    private Ligne ligne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_depart_id", nullable = false)
    private Station stationDepart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_arrivee_id", nullable = false)
    private Station stationArrivee;

    @Column(name = "heure_depart_aller", nullable = false)
    private LocalTime heureDepartAller;

    @Column(name = "heure_depart_retour")
    private LocalTime heureDepartRetour;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // ✅ NOUVEAU: Indique si le bus commence sa journée à la station de départ (true) ou de destination (false)
    @Column(name = "commence_a_station_depart", nullable = false)
    private Boolean commenceAStationDepart = true;
}