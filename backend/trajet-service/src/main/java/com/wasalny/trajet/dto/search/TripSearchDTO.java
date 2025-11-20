package com.wasalny.trajet.dto.search; 
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalDate;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class TripSearchDTO {  
      
    private UUID stationDepartId;  
    private UUID stationArriveeId;  
    private LocalDate date;  
}