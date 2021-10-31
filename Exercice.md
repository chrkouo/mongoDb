# Exercice

## Objectif

Vous devez créer une couche de persistance pouvant effectuer des actions sur une liste de cours selon un domaine d'affaire fourni.

Voici l'allure de l'entité:

`cours`

```javascript
{
  "_id": 1,
  "nom": "Architecture web"
}
```

## Travail à réaliser

Vous devez créer le fichier `courseDB.js`. Il devra exporter les méthodes nécéssaires au bon fonctionnement du domaine fourni.

## Éléments fournis

Le fichier `courses.js`, notre domaine d'affaire qui a aujourd'hui besoin d'une persistance.

Le fichier `main.js` qui vous servira pour utiliser votre application. Il vous permet les trois actions suivante:

- `node main.js get`
- `node main.js add "[nom du cours]"`
- `node main.js remove [id du cours]`
