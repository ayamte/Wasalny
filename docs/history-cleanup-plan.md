# Proposition de nettoyage de l'historique

Statut : plan initial exécuté après accord dans une copie isolée. Le dépôt Git d'origine est conservé. Voir [le résultat et les contrôles de conservation](history-cleanup-result.md). Toute installation dans le dépôt original ou publication nécessite un accord séparé.

## Constats

L'analyse des références locales a identifié des clés JWT et des jetons dans des configurations et documents historiques. Le rapport masqué est conservé dans `.local-audit/history-secrets.json`. Certaines occurrences sont des répétitions ou des exemples et doivent être distinguées avant le remplacement. Aucun fichier `.env` suivi n'a été trouvé dans l'historique accessible localement.

## Sauvegarde disponible

- `.local-audit/before-cleanup.bundle` : sauvegarde Git complète créée avec `--all`, vérifiée avec `git bundle verify`.
- `.local-audit/before-cleanup.zip` : fichiers du commit initial `f199150`.

Ces sauvegardes sont exclues de Git et contiennent les anciennes valeurs sensibles. Elles doivent rester privées. Avant la réécriture, créer aussi une sauvegarde des modifications finales et des références alors présentes.

## Opération proposée après accord

1. Renouveler ou révoquer les valeurs qui ont réellement servi, auprès de leurs systèmes d'origine. Le nettoyage Git ne révoque pas une clé.
2. Travailler dans une copie distincte du dépôt sauvegardé ; ne pas réécrire le répertoire de travail contenant les corrections non commitées.
3. Préparer une liste locale de remplacements exacts pour les valeurs confirmées. Conserver les sources métier, tests, auteurs et messages de contribution ; ne pas supprimer un fichier entier lorsqu'un remplacement ciblé suffit.
4. Appliquer les remplacements à toutes les branches et étiquettes concernées, puis scanner à nouveau le contenu et l'historique complet.
5. Vérifier les différences, les auteurs, les branches et les tests. Fournir le résultat avant toute publication.

## Impact

Les commits touchés et leurs descendants auraient de nouveaux identifiants. Les signatures éventuelles ne seraient plus valides, et les collaborateurs devraient resynchroniser leurs clones sans réintroduire les anciens commits. Les anciens clones, forks et caches ne seraient pas effacés par cette opération.

La publication d'un historique réécrit nécessiterait un push forcé coordonné avec l'équipe. Elle constitue une étape séparée et ne sera pas effectuée sans autorisation explicite.
