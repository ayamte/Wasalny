package com.wasalny.trajet.controller;  
  
import com.wasalny.trajet.dto.request.LigneCreateDTO;  
import com.wasalny.trajet.dto.request.LigneStationCreateDTO;  
import com.wasalny.trajet.dto.response.LigneResponseDTO;  
import com.wasalny.trajet.dto.response.LigneStationResponseDTO;  
import com.wasalny.trajet.service.LigneService;  
import jakarta.validation.Valid;  
import lombok.RequiredArgsConstructor;  
import org.springframework.http.HttpStatus;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.*;  
  
import java.util.List;  
import java.util.UUID;  
  
@RestController  
@RequestMapping("/lignes")  
@RequiredArgsConstructor  
public class LigneController {  
      
    private final LigneService ligneService;  
      
    /**  
     * POST /lignes - Créer une nouvelle ligne  
     */  
    @PostMapping  
    public ResponseEntity<LigneResponseDTO> creerLigne(@Valid @RequestBody LigneCreateDTO dto) {  
        LigneResponseDTO ligne = ligneService.creerLigne(dto);  
        return ResponseEntity.status(HttpStatus.CREATED).body(ligne);  
    }  
      
    /**  
     * POST /lignes/stations - Ajouter une station à une ligne  
     */  
    @PostMapping("/stations")  
    public ResponseEntity<LigneStationResponseDTO> ajouterStationALigne(  
            @Valid @RequestBody LigneStationCreateDTO dto) {  
        LigneStationResponseDTO ligneStation = ligneService.ajouterStationALigne(dto);  
        return ResponseEntity.status(HttpStatus.CREATED).body(ligneStation);  
    }  
      
    /**  
     * GET /lignes - Obtenir toutes les lignes actives  
     */  
    @GetMapping  
    public ResponseEntity<List<LigneResponseDTO>> listerLignesActives() {  
        List<LigneResponseDTO> lignes = ligneService.obtenirLignesActives();  
        return ResponseEntity.ok(lignes);  
    }  
      
    /**  
     * GET /lignes/{id} - Obtenir une ligne par ID avec ses stations  
     */  
    @GetMapping("/{id}")  
    public ResponseEntity<LigneResponseDTO> obtenirLigne(@PathVariable UUID id) {  
        LigneResponseDTO ligne = ligneService.obtenirLigneParId(id);  
        return ResponseEntity.ok(ligne);  
    }  
      
    /**  
     * GET /lignes/{id}/stations - Obtenir les stations d'une ligne  
     */  
    @GetMapping("/{id}/stations")  
    public ResponseEntity<List<LigneStationResponseDTO>> obtenirStationsDeLigne(@PathVariable UUID id) {  
        List<LigneStationResponseDTO> stations = ligneService.obtenirStationsDeLigne(id);  
        return ResponseEntity.ok(stations);  
    }  
      
    /**  
     * PUT /lignes/{id}/desactiver - Désactiver une ligne  
     */  
    @PutMapping("/{id}/desactiver")  
    public ResponseEntity<Void> desactiverLigne(@PathVariable UUID id) {  
        ligneService.desactiverLigne(id);  
        return ResponseEntity.noContent().build();  
    }  
      
    /**  
     * PUT /lignes/{id}/activer - Activer une ligne  
     */  
    @PutMapping("/{id}/activer")  
    public ResponseEntity<Void> activerLigne(@PathVariable UUID id) {  
        ligneService.activerLigne(id);  
        return ResponseEntity.noContent().build();  
    }  
}