package com.wasalny.geolocalisation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GeolocalisationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(GeolocalisationServiceApplication.class, args);
    }
}
