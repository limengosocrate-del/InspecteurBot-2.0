# Cahier des charges — ajout : fusion des deux listes déclaratives

## Utilisation des deux listes déclaratives pour les lieux d’affectation

La base du personnel utilise les deux documents officiels suivants, parcourus intégralement et fusionnés :

1. `LISTE DECLARATIVE DU PERSONNEL DE L'INSPECTION DU TRAVAIL DE LA RDC-1-67.pdf`
2. `LISTE DECLARATIVE DU PERSONNEL DE L'INSPECTION DU TRAVAIL DE LA RDC-67-134.pdf`

### Règles obligatoires d’importation

- Nom complet : colonne **NOMS, POST NOMS ET PRÉNOMS** ;
- Matricule : colonne **MATRICULE** ;
- Grade : colonne **GRADE** ;
- Fonction : colonne **FONCTION** ;
- Lieu d’affectation : dernière colonne **LIEU D’AFFECTATION** ;
- La fusion est réalisée par matricule normalisé (espaces et séparateurs ignorés pour la comparaison, valeur officielle conservée à l’affichage).

Une valeur de lieu lisible dans l’un ou l’autre document complète la fiche de l’agent correspondant. Les titres de sections fournissent, par héritage, la province et la direction/antenne. Si une cellule de lieu est illisible dans l’extraction mais que la section officielle est identifiée, le siège principal de cette section, tel que défini dans les règles validées du projet, sert de valeur héritée plutôt qu’une mention « Non renseigné ».

Aucune donnée affichée ne doit être inventée, modifiée ou tirée d’une source extérieure aux listes déclaratives et aux règles administratives officielles validées pour le projet.
