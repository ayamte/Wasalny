package com.wasalny.trajet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class TrajetServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TrajetServiceApplication.class, args);
    }
}
