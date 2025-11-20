package com.wasalny.abonnement.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Converter
public class UuidListConverter implements AttributeConverter<List<UUID>, String> {

    private static final String DELIMITER = ",";

    @Override
    public String convertToDatabaseColumn(List<UUID> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "";
        }
        return attribute.stream()
                .map(UUID::toString)
                .collect(Collectors.joining(DELIMITER));
    }

    @Override
    public List<UUID> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(dbData.split(DELIMITER))
                .map(String::trim)
                .map(UUID::fromString)
                .collect(Collectors.toList());
    }
}
