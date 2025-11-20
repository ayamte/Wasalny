package com.wasalny.trajet.config;  
  
import io.swagger.v3.oas.models.OpenAPI;  
import io.swagger.v3.oas.models.info.Info;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
@Configuration  
public class OpenApiConfig {  
      
    @Bean  
    public OpenAPI trajetServiceAPI() {  
        return new OpenAPI()  
            .info(new Info()  
                .title("Trajet Service API")  
                .version("1.0.0")  
                .description("API de gestion des trajets, lignes, stations et trips"));  
    }  
}