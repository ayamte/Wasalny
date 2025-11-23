# Test Manuel de l'Endpoint POST /paiements/initier

## ✅ État des Services

Tous les services sont opérationnels :
- ✅ auth-service : http://localhost:8086 (healthy)
- ✅ paiement-service : http://localhost:8082 (healthy)
- ✅ api-gateway : http://localhost:8080 (healthy)
- ✅ user-service : http://localhost:8083 (healthy)

## 📋 Instructions de Test

### Option 1 : Utiliser Postman ou Thunder Client (Recommandé)

#### Étape 1 : Login pour obtenir le token

**Requête :**
```
POST http://localhost:8086/auth/login
Content-Type: application/json

{
  "email": "ahmed@gmail.com",
  "password": "<REDACTED>"
}
```

**Réponse attendue :**
```json
{
  "token": "<REDACTED>",
  "expiresIn": 86400000,
  "userId": "33e9fd70-dcf4-436f-97d1-d1532a157526",
  "email": "ahmed@gmail.com",
  "username": "ahmed",
  "role": "CLIENT",
  "nom": "ahmed",
  "prenom": "ahmed",
  "telephone": "+212068888889"
}
```

**Action :** Copiez le `token` et le `userId` pour les étapes suivantes.

---

#### Étape 2 : Tester l'endpoint de paiement

**Requête :**
```
POST http://localhost:8082/paiements/initier
Authorization: Bearer {VOTRE_TOKEN_ICI}
Content-Type: application/json

{
  "clientId": "{VOTRE_USER_ID_ICI}",
  "montant": 7.00,
  "typePaiement": "CARTE_BANCAIRE",
  "typeService": "ACHAT_TICKET",
  "referenceService": "123e4567-e89b-12d3-a456-426614174000",
  "description": "Achat ticket de bus - Test",
  "infoCarte": {
    "numeroCarte": "4532123456789012",
    "nomTitulaire": "AHMED AHMED",
    "dateExpiration": "12/26",
    "cvv": "123"
  }
}
```

**Réponse attendue (succès) :**
```json
{
  "id": "uuid-de-la-transaction",
  "reference": "PAY-XXXXXXXX",
  "clientId": "33e9fd70-dcf4-436f-97d1-d1532a157526",
  "montant": 7.00,
  "devise": "MAD",
  "typePaiement": "CARTE_BANCAIRE",
  "statut": "EN_ATTENTE",
  "dateTransaction": "2025-11-20T17:15:00",
  "typeService": "ACHAT_TICKET",
  "referenceService": "123e4567-e89b-12d3-a456-426614174000",
  "description": "Achat ticket de bus - Test",
  "motifEchec": null,
  "createdAt": "2025-11-20T17:15:00"
}
```

---

### Option 2 : Utiliser le Frontend

1. Ouvrez le navigateur : http://localhost:3000
2. Connectez-vous avec :
   - Email : `ahmed@gmail.com`
   - Password : `ahmed123`
3. Naviguez vers la page d'achat de tickets
4. Sélectionnez un trajet et procédez au paiement
5. Vérifiez dans la console du navigateur (F12) les requêtes réseau

---

### Option 3 : Utiliser curl (si disponible)

```bash
# 1. Login
curl -X POST http://localhost:8086/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@gmail.com","password":"ahmed123"}'

# 2. Copier le token et userId, puis :
curl -X POST http://localhost:8082/paiements/initier \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {VOTRE_TOKEN}" \
  -d '{
    "clientId": "{VOTRE_USER_ID}",
    "montant": 7.00,
    "typePaiement": "CARTE_BANCAIRE",
    "typeService": "ACHAT_TICKET",
    "referenceService": "123e4567-e89b-12d3-a456-426614174000",
    "description": "Achat ticket de bus - Test",
    "infoCarte": {
      "numeroCarte": "4532123456789012",
      "nomTitulaire": "AHMED AHMED",
      "dateExpiration": "12/26",
      "cvv": "123"
    }
  }'
```

---

## 🔍 Vérification des Résultats

### Cas de succès (Status 201 Created)
- Le paiement est créé avec le statut `EN_ATTENTE`
- Vous recevez un `id` et une `reference` de transaction
- Le `motifEchec` est `null`

### Cas d'erreur possibles

#### 401 Unauthorized
- Le token est invalide ou expiré
- Solution : Refaire le login pour obtenir un nouveau token

#### 400 Bad Request
- Les données envoyées sont invalides
- Vérifiez que :
  - `clientId` est un UUID valide
  - `montant` est un nombre positif
  - `typeService` est soit `ACHAT_TICKET` soit `ABONNEMENT`
  - `referenceService` est un UUID valide

#### 403 Forbidden
- L'utilisateur n'a pas le rôle `CLIENT`
- Vérifiez que vous êtes connecté avec un compte CLIENT

---

## 📝 Notes Importantes

1. **typeService** : Doit être `ACHAT_TICKET` ou `ABONNEMENT`
2. **typePaiement** : Peut être `CARTE_BANCAIRE`, `MOBILE_MONEY`, ou `ESPECES`
3. **referenceService** : 
   - Pour un ticket : UUID du trip
   - Pour un abonnement : UUID du type d'abonnement
4. **infoCarte** : Optionnel si `typePaiement` n'est pas `CARTE_BANCAIRE`

---

## 🐛 Dépannage

Si PowerShell ne fonctionne pas, c'est probablement dû à des problèmes SSL/TLS.

**Solution recommandée :** Utilisez Postman, Thunder Client (extension VS Code), ou testez directement depuis le frontend.

