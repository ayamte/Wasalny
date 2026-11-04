# Nettoyage de l'historique : résultat

Nettoyage autorisé et effectué le 4 novembre 2026 dans une copie isolée. Aucun push, aucune modification du dépôt Git partagé d'origine.

## Copie prête à examiner

La copie de travail nettoyée se trouve dans :

```text
.local-audit/history-rewrite/review-repository
```

Depuis le dépôt original, ouvrir ce dossier comme nouveau projet pour poursuivre le travail sur l'historique nettoyé. Ses 23 branches sont locales et aucune destination de push n'est configurée. Les corrections techniques restent non commitées, comme dans le dépôt original. Le README a été ajouté après le nettoyage, à partir du rapport de conception et de l'implémentation actuelle ; dans ses anciennes versions, seuls les secrets ont été remplacés.

Le dépôt original conserve son ancien historique et ses fichiers de travail. La copie nettoyée est celle à utiliser pour une éventuelle publication ultérieure, après autorisation. L'installation de cet historique dans le dépôt original n'a pas été effectuée. Le second worktree déjà enregistré dans Git est laissé intact.

## Contrôles de conservation

| Contrôle | Résultat |
| --- | --- |
| Commits de l'équipe | 68 conservés, aucun supprimé ou regroupé |
| Branches | 23 conservées ; les anciennes branches de suivi sont représentées comme branches locales dans la copie |
| Fusions | 8 conservées avec le même ordre des parents |
| Versions de fichiers comparées | 19 623 |
| Fichiers supprimés, ajoutés ou renommés par la purge | Aucun |
| Auteurs, committers et dates | Identiques |
| Messages de commit | Identiques |
| Contenus historiques modifiés | Uniquement les valeurs prévues : clés et jetons, mots de passe partagés, hash de démonstration et identifiants Basic Auth d'exemple |
| Fichiers actuels au moment de la purge | Les 452 fichiers sauvegardés ont conservé exactement les mêmes octets dans le dépôt original |
| Corrections reportées initialement | 452 fichiers restaurés à l'identique ; les 22 suppressions de la passe technique sont conservées |
| Scan complet de l'historique nettoyé | Aucun secret signalé, 6,82 Mo analysés ; 57 commits avec contenu scannés, sur 68 commits incluant les fusions |
| Ancien HEAD | `f19915006508dfea110df9daa9478518c5758353` |
| Nouveau HEAD | `9c7c9b5863989ad84d86c6e182df56e28e33b832` |

La comparaison vérifie chaque chemin, chaque mode de fichier, les métadonnées des commits, leurs parents et le contenu attendu des blobs. Les sources métier Java/React et les tests n'ont subi aucun changement pendant la purge. Les corrections ultérieures du répertoire de travail sont vérifiées séparément et consignées dans [verification.md](verification.md).

Quatre signatures cryptographiques originales ne peuvent plus valider les nouveaux commits. Les originaux signés sont conservés dans la sauvegarde ; aucune signature de remplacement n'a été ajoutée. Tous les identifiants de commit ont changé, car la première valeur supprimée se trouvait tôt dans l'historique.

## Sauvegardes privées

Dans le dépôt original, conserver privés les éléments suivants :

- `.local-audit/history-rewrite/before-rewrite.bundle` : historique complet d'origine, vérifié.
- `.local-audit/history-rewrite/working-tree-backup/` : copie des fichiers courants avant purge, vérifiée par SHA-256.
- `.local-audit/history-rewrite/working-tree.patch` et `working-tree-manifest.json` : modifications et suppressions initiales.
- `.local-audit/history-rewrite/preservation-report.json` : résultat des comparaisons.
- `.local-audit/history-rewrite/cleaned.git/filter-repo/commit-map` : correspondance des anciens et nouveaux commits.
- `.local-audit/followup-backup/` : copie des fichiers modifiés lors de la passe de vérification suivante.

Les sauvegardes originales et le dépôt original contiennent encore les anciennes valeurs sensibles. Ils ne doivent pas être publiés. Les jetons et clés qui ont réellement servi restent à renouveler ou révoquer auprès des systèmes concernés. Aucun accès à ces systèmes n'a été effectué.

La publication d'un historique réécrit doit être coordonnée avec l'équipe et fera l'objet d'une autorisation séparée. Aucun push n'a été effectué.
