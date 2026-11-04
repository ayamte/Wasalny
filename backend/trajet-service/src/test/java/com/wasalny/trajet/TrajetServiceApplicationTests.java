package com.wasalny.trajet;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.security.SecureRandom;
import java.util.Base64;

@SpringBootTest(properties = {
    "spring.config.name=application-test",
    "spring.cloud.config.enabled=false",
    "eureka.client.enabled=false",
    "spring.datasource.url=jdbc:h2:mem:trajet;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class TrajetServiceApplicationTests {

    @DynamicPropertySource
    static void jwtProperties(DynamicPropertyRegistry registry) {
        byte[] key = new byte[64];
        new SecureRandom().nextBytes(key);
        registry.add("security.jwt.secret-key", () -> Base64.getEncoder().encodeToString(key));
    }

	@Test
	void contextLoads() {
	}

}
