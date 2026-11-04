package com.wasalny.auth.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class UserProfileClientConfiguration {
    @Bean
    RequestInterceptor internalProfileCredentials(@Value("${internal.api-key}") String key) {
        return template -> template.header("X-Internal-Token", key);
    }
}
