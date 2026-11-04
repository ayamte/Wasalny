package com.wasalny.auth.repository;

import com.wasalny.auth.entity.RoleUtilisateur;
import com.wasalny.auth.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest(properties = {
    "spring.config.name=application-test",
    "spring.cloud.config.enabled=false"
})
class UserRepositoryTest {
    @Autowired UserRepository repository;
    @Autowired TestEntityManager entityManager;

    @Test
    void loginAccountKeepsItsPublicUuidAfterPersistence() {
        User user = new User("persistence-test", "persistence@example.test", "unused-test-hash");
        user.setRole(RoleUtilisateur.CLIENT);
        user.setDateCreation(LocalDateTime.now());

        User saved = entityManager.persistAndFlush(user);

        assertNotNull(saved.getId());
        entityManager.clear();
        assertEquals(user.getUuid(), repository.findByEmail(user.getEmail()).orElseThrow().getUuid());
    }
}
