package com.wasalny.auth.service;

import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = UserProfileClientTest.Config.class, properties = {
        "spring.config.name=application-profile-client-test",
        "spring.cloud.config.enabled=false",
        "spring.cloud.config.import-check.enabled=false",
        "eureka.client.enabled=false",
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
}, webEnvironment = SpringBootTest.WebEnvironment.NONE)
class UserProfileClientTest {
    private static final AtomicReference<String> RECEIVED_KEY = new AtomicReference<>();
    private static final AtomicReference<String> RECEIVED_REQUEST = new AtomicReference<>();
    private static final String KEY;
    private static final HttpServer SERVER;

    static {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        KEY = Base64.getEncoder().encodeToString(key);
        try {
            SERVER = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            SERVER.createContext("/users/admin/users/create", exchange -> {
                RECEIVED_KEY.set(exchange.getRequestHeaders().getFirst("X-Internal-Token"));
                RECEIVED_REQUEST.set(exchange.getRequestMethod() + " " + exchange.getRequestURI());
                byte[] body = "{}".getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, body.length);
                try (var output = exchange.getResponseBody()) { output.write(body); }
                exchange.close();
            });
            SERVER.start();
        } catch (IOException exception) {
            throw new ExceptionInInitializerError(exception);
        }
    }

    @Configuration(proxyBeanMethods = false)
    @EnableAutoConfiguration
    @EnableFeignClients(clients = UserProfileClient.class)
    static class Config { }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("user.service.url", () -> "http://127.0.0.1:" + SERVER.getAddress().getPort());
        registry.add("internal.api-key", () -> KEY);
    }

    @Autowired UserProfileClient client;

    @Test
    void createsProfileAtConfiguredUrlWithInternalCredentialsWithoutDiscovery() {
        var response = client.createProfile("a303005d-135f-4cda-96b4-252aa2b0c48d",
                "owner@example.test", "owner", "CLIENT", "2026-01-01T12:00:00",
                "Nom", "Prenom", null, null);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(KEY, RECEIVED_KEY.get());
        assertTrue(RECEIVED_REQUEST.get().startsWith("POST /users/admin/users/create?"));
        assertTrue(RECEIVED_REQUEST.get().contains("role=CLIENT"));
    }

    @AfterAll
    static void stopServer() { SERVER.stop(0); }
}
