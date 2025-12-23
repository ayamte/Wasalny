-- Script pour créer un utilisateur admin dans la base de données
-- Utilisation : Copiez et collez ce contenu dans votre terminal psql actif

-- 1. Vérifier si un admin existe déjà
SELECT id, email, username, role FROM user_profiles WHERE role = 'ADMIN';

-- 2. Insérer un nouvel utilisateur admin
INSERT INTO user_profiles (uuid, email, username, role, date_creation) 
VALUES (
    gen_random_uuid(), 
    'admin@wasalny.com', 
    'admin', 
    'ADMIN', 
    NOW()
);

-- 3. Vérifier que l'utilisateur a été créé
SELECT id, uuid, email, username, role, date_creation FROM user_profiles WHERE role = 'ADMIN';
