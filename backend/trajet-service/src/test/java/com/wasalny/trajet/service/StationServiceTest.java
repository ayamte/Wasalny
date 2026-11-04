package com.wasalny.trajet.service;

import com.wasalny.trajet.dto.request.StationCreateDTO;
import com.wasalny.trajet.entity.Station;
import com.wasalny.trajet.repository.StationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StationServiceTest {
    @Mock StationRepository repository;
    @InjectMocks StationService service;

    @Test
    void duplicateStationIsRejectedWithoutSaving() {
        StationCreateDTO request = new StationCreateDTO();
        request.setNom("Centre");
        when(repository.findByNom("Centre")).thenReturn(Optional.of(new Station()));

        assertThrows(IllegalArgumentException.class, () -> service.creerStation(request));
        verify(repository, never()).save(any());
    }
}
