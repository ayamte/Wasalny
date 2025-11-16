package com.wasalny.ticket.controller;

import com.wasalny.ticket.dto.TicketResponse;
import com.wasalny.ticket.entity.Ticket;
import com.wasalny.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@Slf4j
public class TicketController {  
      
    private final TicketService ticketService;  
      
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable UUID id) {  
        Ticket ticket = ticketService.getTicket(id);  
        return ResponseEntity.ok(TicketResponse.fromEntity(ticket));  
    }  
      
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<List<TicketResponse>> getTicketsClient(@PathVariable UUID clientId) {  
        List<Ticket> tickets = ticketService.getTicketsClient(clientId);  
        List<TicketResponse> responses = tickets.stream()  
            .map(TicketResponse::fromEntity)  
            .collect(Collectors.toList());  
        return ResponseEntity.ok(responses);  
    }  
      
    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> validerTicket(@PathVariable UUID id) {  
        Ticket ticket = ticketService.validerTicket(id);  
        return ResponseEntity.ok(TicketResponse.fromEntity(ticket));  
    }  
      
    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<TicketResponse> annulerTicket(@PathVariable UUID id) {  
        Ticket ticket = ticketService.annulerTicket(id);  
        return ResponseEntity.ok(TicketResponse.fromEntity(ticket));  
    }  
    @PutMapping("/{id}/rembourser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> rembourserTicket(@PathVariable UUID id) {  
        Ticket ticket = ticketService.rembourserTicket(id);  
        return ResponseEntity.ok(TicketResponse.fromEntity(ticket));  
    }
}