-- Migration: Ajout des colonnes pour l'assignation des bus au départ et à la destination
-- Date: 2025-11-25
-- Description: Cette migration ajoute deux nouvelles colonnes pour gérer le nombre de bus
--              assignés à la station de départ et à la station de destination

-- Ajouter les colonnes pour l'assignation des bus
ALTER TABLE configuration_horaire
ADD COLUMN nombre_bus_depart INT NOT NULL DEFAULT 0,
ADD COLUMN nombre_bus_destination INT NOT NULL DEFAULT 0;

-- Mettre à jour les valeurs par défaut pour les configurations existantes
-- On divise le nombre de bus total par 2 (moitié au départ, moitié à la destination)
UPDATE configuration_horaire
SET nombre_bus_depart = FLOOR(nombre_bus / 2),
    nombre_bus_destination = CEIL(nombre_bus / 2)
WHERE nombre_bus_depart = 0 AND nombre_bus_destination = 0;

-- Ajouter des contraintes de validation
ALTER TABLE configuration_horaire
ADD CONSTRAINT check_bus_depart_positive CHECK (nombre_bus_depart >= 0);

ALTER TABLE configuration_horaire
ADD CONSTRAINT check_bus_destination_positive CHECK (nombre_bus_destination >= 0);

-- Optionnel: Ajouter une contrainte pour s'assurer que la somme des bus assignés ne dépasse pas le total
ALTER TABLE configuration_horaire
ADD CONSTRAINT check_bus_assignment_total CHECK (nombre_bus_depart + nombre_bus_destination <= nombre_bus * 2);

-- Commentaires pour la documentation
COMMENT ON COLUMN configuration_horaire.nombre_bus_depart IS 'Nombre de bus assignés à la station de départ (commencent leur journée à la station A)';
COMMENT ON COLUMN configuration_horaire.nombre_bus_destination IS 'Nombre de bus assignés à la station de destination (commencent leur journée à la station B)';
