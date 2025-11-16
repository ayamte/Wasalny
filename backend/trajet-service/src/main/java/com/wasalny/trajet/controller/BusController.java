package com.wasalny.trajet.controller;  
  
import com.wasalny.trajet.dto.request.BusCreateDTO;  
import com.wasalny.trajet.dto.response.BusResponseDTO;  
import com.wasalny.trajet.service.BusService;  
import jakarta.validation.Valid;  
import lombok.RequiredArgsConstructor;  
import org.springframework.http.HttpStatus;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.*;  
  
import java.util.List;  
import java.util.UUID;  
  
@RestController  
@RequestMapping("/buses")  
@RequiredArgsConstructor  
public class BusController {  
      
    private final BusService busService;  
      
    /**  
     * POST /buses - Créer un nouveau bus  
     */  
    @PostMapping  
    public ResponseEntity<BusResponseDTO> creerBus(@Valid @RequestBody BusCreateDTO dto) {  
        BusResponseDTO bus = busService.creerBus(dto);  
        return ResponseEntity.status(HttpStatus.CREATED).body(bus);  
    }  
      
    /**  
     * GET /buses - Obtenir tous les bus actifs  
     */  
    @GetMapping  
    public ResponseEntity<List<BusResponseDTO>> listerBusActifs() {  
        List<BusResponseDTO> buses = busService.obtenirBusActifs();  
        return ResponseEntity.ok(buses);  
    }  
      
    /**  
     * GET /buses/{id} - Obtenir un bus par ID  
     */  
    @GetMapping("/{id}")  
    public ResponseEntity<BusResponseDTO> obtenirBus(@PathVariable UUID id) {  
        BusResponseDTO bus = busService.obtenirBusParId(id);  
        return ResponseEntity.ok(bus);  
    }  
      
    /**  
     * GET /buses/immatriculation/{numero} - Obtenir un bus par immatriculation  
     */  
    @GetMapping("/immatriculation/{numero}")  
    public ResponseEntity<BusResponseDTO> obtenirBusParImmatriculation(@PathVariable String numero) {  
        BusResponseDTO bus = busService.obtenirBusParImmatriculation(numero);  
        return ResponseEntity.ok(bus);  
    }  
      
    /**  
     * PUT /buses/{id}/desactiver - Désactiver un bus  
     */  
    @PutMapping("/{id}/desactiver")  
    public ResponseEntity<Void> desactiverBus(@PathVariable UUID id) {  
        busService.desactiverBus(id);  
        return ResponseEntity.noContent().build();  
    }  
      
    /**  
     * PUT /buses/{id}/activer - Activer un bus  
     */  
    @PutMapping("/{id}/activer")  
    public ResponseEntity<Void> activerBus(@PathVariable UUID id) {  
        busService.activerBus(id);  
        return ResponseEntity.noContent().build();  
    }  
}