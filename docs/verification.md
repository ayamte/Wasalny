# Vérification technique

État du 4 novembre 2026. Ce fichier suit les corrections et leurs limites. Le README décrit principalement l'implémentation actuelle, avec le contexte du rapport conceptuel. Trois captures extraites de la vidéo de démonstration et les trois diagrammes originaux fournis par l'équipe sont intégrés.

## Périmètre

- Les huit services métier, les trois services d'infrastructure et le frontend sont conservés.
- Dans le dépôt original, aucun commit d'équipe, auteur, branche ou historique n'a été supprimé ou réécrit. Après accord, une copie indépendante de l'historique a été nettoyée ; voir [history-cleanup-result.md](history-cleanup-result.md). Aucun push effectué.
- Une sauvegarde Git complète vérifiée et une archive de l'état initial sont conservées localement dans `.local-audit/`, exclu du suivi Git. Ces sauvegardes contiennent les anciennes valeurs sensibles et ne doivent pas être publiées.
- Les bundles frontend générés, deux journaux de compilation/exécution et deux écrans de diagnostic inutilisés ont été retirés. Le script SQL qui créait un profil administrateur sans compte de connexion a été remplacé par un diagnostic en lecture seule. Les sources des images restent disponibles.
- Les annotations de test factices ont été remplacées par JUnit/Spring Boot ; le test de contexte existant est réellement exécuté avec H2. Les neuf fichiers de tests et de configuration de test, couvrant quatorze cas JUnit, sont conservés à l'identique lors du nettoyage des sources.
- Après sauvegarde, 58 fichiers Java entièrement vides, un exemple de routeur inutilisé et l'ancien contrôleur de diagnostic `/test` ont été retirés. La santé des services reste exposée par Actuator. Les fonctionnalités métier existantes sont conservées.
- Les anciens guides de démonstration et le résumé redondant ont été regroupés dans [tests-manuels.md](tests-manuels.md), sans les ports, comptes et UUID périmés. Deux scripts PowerShell de paiement et deux lanceurs frontend redondants ont été retirés ; un exemple de requête HTTP est conservé dans `scripts/manual/paiement.http`.
- Le `.gitignore` et les douze `.dockerignore` excluent les clés/certificats privés et fichiers temporaires. Le `.gitignore` couvre aussi les caches, rapports de couverture, fichiers Java compilés et environnements privés HTTP. Les modèles `.env.example`, les dépendances verrouillées, les tests, les wrappers Maven et les visuels restent disponibles dans Git.
- Les 84 fichiers concernés par cette passe ont été sauvegardés dans `.local-audit/cleanup/backup/` avant modification ou retrait. Le plan et les empreintes de l'état initial sont conservés dans `.local-audit/cleanup/plan.json` ; les 381 autres fichiers de sources et ressources sont restés identiques.

## Corrections

- Les secrets n'ont plus de valeurs partagées par défaut. `node scripts/init-env.mjs` crée un `.env` avec des valeurs aléatoires et refuse d'écraser un fichier existant. Les variables sont décrites dans `.env.example`.
- Les services qui vérifient les JWT reçoivent la même clé et utilisent l'email comme identité de connexion, même lorsque le nom d'utilisateur diffère. La création interne des profils utilise une clé dédiée. Le service utilisateurs impose une authentification et contrôle les accès aux profils et à l'administration.
- Le contrôle du propriétaire couvre aussi la suppression du profil client et la demande de changement de mot de passe. Huit tests MVC utilisent la configuration de sécurité réelle et des JWT signés avec des clés générées pendant les tests. Ils vérifient les rôles, la portée de la clé interne, les JWT expirés ou mal signés et l'accès aux profils par UUID ou email. Les opérations métier sont simulées : aucune donnée réelle n'est supprimée par ces tests.
- L'inscription publique ne peut plus créer de comptes ADMIN ou CONDUCTEUR. La vérification d'email est rétablie ; Mailpit permet de recevoir les messages localement à `http://localhost:8025`.
- Les adresses PostgreSQL utilisent les bons services et ports internes. Les propriétés Redis utilisent `spring.data.redis` et le contrôle de santé s'authentifie.
- Les configurations bootstrap redondantes ont été retirées au profit de `spring.config.import`. Le serveur de configuration expose maintenant le contrôle de santé Actuator requis par Compose.
- Les dépendances Java ont été alignées sur Spring Boot 3.5.16 et Spring Cloud 2025.0.3, en conservant Java 17. Les routes Gateway ont été adaptées à leur nouvelle propriété de configuration. La migration vers Spring Boot 4 reste hors de cette passe.
- Les builds Docker Java utilisent plusieurs étapes et un utilisateur d'exécution sans privilèges. Le frontend utilise `npm ci` avec son verrouillage. Les `.dockerignore` excluent les environnements et fichiers générés, tout en conservant les tests.
- Le frontend utilise les proxies Vite/nginx pour les API et SockJS ; il ne suppose plus que le navigateur accède directement aux ports des services. Le paiement est présenté comme une simulation, sans débit réel. Les nouvelles transactions ne conservent plus les informations de carte.
- La CI prépare compilation Java, tests, build frontend, audit npm, scan des secrets du répertoire courant et test de lancement Compose. Dependabot suit les dépendances npm, Maven et GitHub Actions.

## Reproduire les vérifications

Prérequis : Java 17 ou 21, Maven 3.9, Node.js 22.12 ou supérieur et Docker Compose. Prévoir les ressources nécessaires à onze applications Java et huit bases PostgreSQL.

```powershell
mvn -B -ntp verify
Push-Location frontend
npm ci
npm run build
npm audit --audit-level=moderate
Pop-Location
node scripts/init-env.mjs
docker compose config --quiet
docker compose up -d --build --wait --wait-timeout 900
node scripts/smoke.mjs
```

Le test `smoke.mjs` crée un compte de démonstration avec un mot de passe aléatoire et attend sa vérification dans Mailpit. Il vérifie le frontend, les routes SPA/API, la connexion, la création du profil et les refus d'accès administrateur/profil tiers. Il est destiné à une instance de développement ou de CI avec Mailpit.

`docker compose down` arrête l'instance et conserve ses volumes. Ne pas ajouter `--volumes` sur une installation contenant des données à conserver. Un changement de mot de passe dans `.env` ne modifie pas les mots de passe d'une base PostgreSQL déjà initialisée.

## Historique et limites

- L'audit Gitleaks de l'ensemble des références locales a signalé 34 occurrences à examiner, dont des clés JWT et jetons dans d'anciens fichiers de configuration et documents. Ce nombre comprend des répétitions et des exemples ; ce n'est pas un décompte de 34 secrets indépendants.
- Le dépôt original conserve les secrets historiques. Une purge ciblée a été effectuée, après accord et sauvegarde, dans une copie indépendante : ses 68 commits, 23 branches et 8 fusions sont conservés et le scan complet ne remonte plus de détection. Les identifiants des commits ont changé. Une installation dans le dépôt original ou une publication reste à autoriser ; la publication doit être coordonnée avec l'équipe. Renouveler les valeurs qui ont réellement servi.
- Le scan CI porte sur les fichiers actuels ; il ne certifie pas que l'historique est purgé. Le rapport détaillé masqué reste local dans `.local-audit/history-secrets.json`.
- Les éventuelles données de carte déjà écrites dans d'anciennes bases n'ont pas été effacées. Aucune migration destructive de données existantes n'a été appliquée.
- Le paiement reste une simulation. Les parcours métier complets de réservation, paiement, ticket, abonnement, notification et géolocalisation doivent être validés séparément ; cette passe ne constitue pas une validation de production ni un audit complet des autorisations métier.
- Aucun administrateur par défaut n'est créé. Le provisionnement initial d'un compte administrateur sur une nouvelle installation reste à définir avant une démonstration des écrans d'administration. Les comptes existants conservent leurs rôles.
- Le changement de mot de passe reste désactivé dans le service utilisateurs ; le test vérifie le refus d'une demande visant un autre utilisateur, pas la réussite du changement. Les suppressions de profils ne sont pas synchronisées avec les comptes d'authentification : ces parcours restent à traiter avant de les présenter comme fonctionnels.
- L'écran React de gestion des clients utilise encore `mockData.js` et un état local, sans persistance dans l'API utilisateurs. Cette fixture est conservée parce que l'écran l'importe réellement ; la suppression de données de démonstration utilisées casserait l'interface.
- Les mises à jour Spring Boot restent dans la branche 3.x : la maintenance à long terme nécessitera une décision de migration. La compatibilité est documentée dans la [matrice officielle Spring Cloud](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions).
- Les workflows GitHub Actions ne seront exécutés sur GitHub qu'après un push autorisé. Aucune publication n'a été effectuée.
- L'interface de la version corrigée n'a pas été vérifiée directement dans un navigateur : le service d'accès au navigateur était indisponible. La compilation frontend et les réponses HTTP ont été vérifiées. Les trois captures du README ont été examinées visuellement, mais proviennent de la vidéo de démonstration et ne constituent pas une vérification du rendu de la version corrigée.
- Aucun audit exhaustif des CVE Maven ou des images de conteneur n'a été effectué. Le résultat « zéro vulnérabilité » ci-dessous concerne uniquement l'audit npm à la date du contrôle.

## Résultats

| Vérification locale | Résultat |
| --- | --- |
| Compilation et vérification Maven | `mvn clean verify` réexécuté après le nettoyage : réussite des onze modules et de l'agrégateur. Les anciennes classes compilées ont été supprimées par Maven avant recompilation. |
| Tests JUnit | Suite complète réexécutée : quatorze tests réussis, aucun échec ni test ignoré. Ils couvrent inscription privilégiée, identité JWT, UUID, station dupliquée, contexte trajets et huit tests MVC de sécurité dans user-service. Les tests de suppression et de changement de mot de passe visant un tiers échouaient avant le correctif de propriétaire. |
| Frontend | Build local réexécuté après le nettoyage, avec succès. Installation par `npm ci` et build Docker réussis lors de la passe initiale. Avertissement sur la taille du bundle restant ; aucune optimisation supplémentaire entreprise. |
| Audit npm | Zéro vulnérabilité signalée après mise à jour du verrouillage. |
| Images Docker | Douze images applicatives construites lors de la passe initiale, puis user-service reconstruit avec les contrôles de propriétaire. Pas de reconstruction des images après le nettoyage des fichiers vides et obsolètes. |
| Compose | Configuration revalidée après nettoyage. Vingt-trois conteneurs en état `healthy` dans le projet isolé `wasalny-audit` lors de la passe initiale. Le démarrage complet n'a pas été relancé après les derniers contrôles de propriétaire ni après ce nettoyage. |
| Parcours HTTP | Inscription CLIENT, refus d'inscription ADMIN, vérification par mail local, connexion, création/lecture du profil, refus d'accès administrateur et profil tiers, JWT accepté par le service trajets : réussite. |
| Routes frontend | Accueil, `/auth`, navigation SPA `/mes-trajets` et information SockJS `/ws/info` répondent. |
| Données de carte | Vérification en lecture seule : aucune colonne de numéro de carte, titulaire, expiration ou CVV dans la table `transactions` de la base neuve de test. |
| Secrets des fichiers actuels | Gitleaks ne signale aucune fuite. Ce résultat ne couvre pas la purge de l'historique. |
| Workflow CI | Validation locale par Actionlint réussie. Exécution sur GitHub non testée. |
| Requête manuelle de paiement | Exemple conservé dans `scripts/manual/paiement.http`, avec variables locales et paiement simulé. Non exécuté pendant le nettoyage. |
| Génération `.env` | Longueur des valeurs générées et refus d'écrasement d'un fichier existant vérifiés. |
| Règles d'exclusion | 34 cas vérifiés par `git check-ignore --no-index` : secrets et sorties générées exclus ; exemples d'environnement, tests, wrappers, verrouillage npm, CI et visuels inclus. Les anciens fichiers `frontend/dist` déjà suivis restent marqués supprimés en attendant un commit ; le `.gitignore` ne modifie pas l'historique ni l'index existant. |
| Documentation | Liens locaux et configuration Compose du démarrage documenté vérifiés. Logo et trois diagrammes copiés à l'identique, avec comparaison SHA-256. Trois captures PNG 1920 × 918 extraites de la vidéo à 00:31, 01:25 et 01:44, puis examinées visuellement ; la barre du navigateur est retirée sans agrandissement de l'image. |
| Git | `git diff --check` réussi ; HEAD conservé à `f199150`. Modifications non commitées, aucun push. |

Le démarrage simultané des applications Java a pris plusieurs minutes sur cette machine. Les périodes de grâce des contrôles de santé ont été adaptées au démarrage à froid. Les journaux, rapports masqués et sauvegardes restent dans `.local-audit/`. L'instance de test est arrêtée après vérification, sans suppression de ses volumes ni des données existantes.

Le plan initial est conservé dans [history-cleanup-plan.md](history-cleanup-plan.md). Le résultat de son exécution dans la copie indépendante et les preuves de conservation sont détaillés dans [history-cleanup-result.md](history-cleanup-result.md).

## Suivi du job Compose sur main

Le run GitHub 41887543412 a valide backend, frontend et secrets, puis echoue au test de lecture du profil (HTTP 403 apres connexion). La limite de 100 lignes des logs ne conservait pas la cause initiale de l'echec eventuel de creation du profil.

Le client Feign de profils utilise maintenant user.service.url, deja configure pour Docker Compose, au lieu de dependre de la premiere actualisation Eureka. Le controle d'acces au profil et l'assertion HTTP 200 restent inchanges. Un test HTTP reel, sans Eureka, verifie la destination configuree, la route POST et la cle interne. Les 5 tests du module auth-service passent localement. La CI conserve desormais 2000 lignes de logs par conteneur en cas d'echec.

La reproduction Docker locale n'a pas abouti : demarrage tres lent et premiere construction interrompue par BuildKit, puis seconde construction arretee. La stack isolee a ete arretee, ses volumes conserves. Le parcours Compose complet apres correction reste a confirmer sur GitHub ; la cause precise du 403 initial n'est pas etablie par les logs disponibles.

La configuration Dependabot a ete retiree de main pour conserver ce projet sans propositions programmees de mises a jour. Les pull requests deja ouvertes ne sont pas fermees par cette suppression.