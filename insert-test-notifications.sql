-- Script SQL pour insérer des notifications de test dans PostgreSQL
-- Connexion: psql -U wasalny_user -d notification_db -h localhost -p 5439

-- Nettoyage (optionnel)
-- TRUNCATE TABLE notifications;

-- Insertion de notifications de test
-- Remplacez '1' par l'ID de votre utilisateur de test

-- Notification 1: Paiement réussi
INSERT INTO notifications (user_id, type, title, message, is_read, created_at, payment_id, amount)
VALUES ('1', 'PAYMENT', 'Paiement confirmé', 'Votre paiement de 50.00 DT a été traité avec succès.', false, NOW() - INTERVAL '2 hours', 'PAY-12345', 50.00);

-- Notification 2: Nouveau ticket
INSERT INTO notifications (user_id, type, title, message, is_read, created_at, ticket_id)
VALUES ('1', 'TICKET', 'Nouveau ticket acheté', 'Votre ticket pour le trajet Tunis-Sfax a été généré.', false, NOW() - INTERVAL '1 hour', 'TICKET-67890');

-- Notification 3: Abonnement renouvelé
INSERT INTO notifications (user_id, type, title, message, is_read, created_at, subscription_id)
VALUES ('1', 'SUBSCRIPTION', 'Abonnement renouvelé', 'Votre abonnement mensuel a été renouvelé automatiquement.', false, NOW() - INTERVAL '30 minutes', 'SUB-54321');

-- Notification 4: Paiement refusé (déjà lue)
INSERT INTO notifications (user_id, type, title, message, is_read, created_at, payment_id, amount)
VALUES ('1', 'PAYMENT', 'Paiement échoué', 'Votre paiement de 30.00 DT a été refusé. Veuillez vérifier vos informations.', true, NOW() - INTERVAL '1 day', 'PAY-99999', 30.00);

-- Notification 5: Ticket expiré
INSERT INTO notifications (user_id, type, title, message, is_read, created_at, ticket_id)
VALUES ('1', 'TICKET', 'Ticket utilisé', 'Votre ticket TICKET-11111 a été validé dans le bus.', true, NOW() - INTERVAL '2 days', 'TICKET-11111');

-- Notification 6: Abonnement expire bientôt
INSERT INTO notifications (user_id, type, title, message, is_read, created_at, subscription_id)
VALUES ('1', 'SUBSCRIPTION', 'Abonnement expire bientôt', 'Votre abonnement expire dans 3 jours. Pensez à le renouveler.', false, NOW() - INTERVAL '10 minutes', 'SUB-99999');

-- Vérification
SELECT * FROM notifications WHERE user_id = '1' ORDER BY created_at DESC;
