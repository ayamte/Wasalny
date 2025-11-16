package com.wasalny.abonnement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AbonnementServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AbonnementServiceApplication.class, args);
    }
}
