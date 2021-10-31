# Notes de cours

## MongoDB

Installation:

- Documentation:
  - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- Lien de téléchargement:
  - https://www.mongodb.com/try/download/community?tck=docs_server

### À lire avant d'installer:

Lors de l'installation, **n'installez pas mongoDB comme un service windows**, mais seulement comme un éxécutable. **N'installez pas Compass non plus**. Regardez comme il faut les cases à cocher!

### Après installation

Avant de rouler mongo, il faut créer un répertoire pour supporter les données. On peut simplement créer un répertoire à l'endroit par défaut où va chercher mongo, soit `/c/data/db`

```
cd c:
mkdir data
mkdir data/db
```

Il faut ensuite rouler l'éxécutable mongoDB qui se trouve au path suivant:

```
/c/Program\ Files/MongoDB/Server/5.0/bin/mongod.exe
```

## Robo 3T

Installation: https://robomongo.org/download

Après l'installation, vous pouvez maintenant lancer Robo 3T et vous connecter à `localhost` sur le port `27017`

C'est dans Robo 3T qu'on va aller se créer une nouvelle base de donnée lors d'une nouvelle connection (à appeler `local`) pour que notre application puisse y accèder. Tout ce passe dans "System/local/Collections On peut aussi s'en servir pour visualiser le contenu de notre persistance.

## Utilisation dans un module node

Il nous faut installer le `driver mongoDB`. Suprise, c'est un module npm.

```
npm install --save mongodb
```

Pour communiquer avec la BD dans un fichier javascript, on pourra ensuite importer le driver et se connecter.

Le driver mongodb supporte les `promises`, que nous pouvons manipuler de manière synchrone avec `async/await`.

```javascript
import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";

const dbName = "local";

const uneFonctionAsynchrone = async () => {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);
  const dogs = db.collection("dogs");
  const res = await dogs.find({});
  console.log(await res.toArray());

  client.close();
};

uneFonctionAsynchrone();
```

La recette sera principalement toujours la même. Les morceaux nécéssaires sont:

- `const client = new MongoClient(url);` pour initialiser le connecteur de bd
- `await client.connect();` pour ouvrir la connection à la bd
- `client.close();` pour fermer la connection à la bd

Bien entendu, vous avez accès à toutes les opérations d'une base de données moderne.

```javascript
import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "local";

const uneFonctionAsynchrone = async () => {
  await client.connect();

  const db = client.db(dbName);
  const dogs = db.collection("dogs");

  // Create
  await dogs.insertOne({ name: "Roger" });

  await dogs.insertMany([{ name: "Togo" }, { name: "Syd" }]);

  // Retreive
  res = await dogs.findOne({ name: "Togo" }); // Attention! Cela donne l'élément directement
  console.log(res);

  let res = await dogs.find({});
  console.log(await res.toArray());

  // Update
  let updatedItems = await dogs.updateOne(
    { name: "Togo" },
    { $set: { name: "Mega-Togo" } }
  );
  console.log(updatedItems.matchedCount); // Nombre de documents qui ont été modifiés

  // Delete
  let deletedRecords = await dogs.deleteOne({ name: "Mega-Togo" });
  console.log(deletedRecords.deletedCount);

  res = await dogs.find({});
  console.log(await res.toArray());

  client.close();
};

uneFonctionAsynchrone();
```

Vous remarquez que lors d'un insert, mongo va automatiquement créer un nouvel _id_, dont la clée va être `_id` (avec un UNDERSCORE!). Plus d'info à la fin.

Pour en apprendre plus sur l'opérateur `$set`, consultez la [documentation](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set).

Il est possible de faire notre select sur un sous-membre, ou sur un array;

```javascript
import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "local";

(async () => {
  await client.connect();
  const db = client.db(dbName);
  const students = db.collection("students");

  await students.insertOne({
    name: "David",
    info: {
      grade: 99.9,
      year: 3,
    },
    courses: ["Architecture Logiciel", "Construction de bateaux en béton"],
  });

  let res = await students.find({ name: "David" });
  console.log(await res.toArray());

  res = await students.find({ "info.year": 3 });
  console.log(await res.toArray());

  res = await students.find({ courses: "Architecture Logiciel" });
  console.log(await res.toArray());

  client.close();
})();
```

Voir la [documentation de querry d'array](https://docs.mongodb.com/manual/tutorial/query-arrays/).

À noter que nous sommes ici 'optimistes' tant qu'à la manière de gérer nos opérations avec la BD, ce qui n'est pas toujours une bonne chose. Nous le faisons ici pour alléger la lecture. Il est préférable de bien gérer les possibles problèmes;

```javascript
try {
  await dogs.insertOne({ name: "Roger" });
  await dogs.insertMany([{ name: "Togo" }, { name: "Syd" }]);
} catch (e) {
  // Lancer une exception propre à notre système pour que le domaine comprenne qu'il y a eu une erreur
  // Faire un log ou auditer l'erreur en production pour vérification humaine
  // Lancer une alerte aux administrateurs du système, nous nous faisons peut-être attaquer
  // etc.
  console.log(e);
}
```

## ObjectId

Le driver mongoDB utilise des ids uniques qu'il est capable de construire lui-même. ces Ids porte le type de `ObjectID`. Il vous est possible de générer et créer des ObjectId, comme par exemple pour trouver ou supprimer un objet de la bd en se basant sur son id.

```javascript
import { MongoClient, ObjectId } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "local";

(async () => {
  await client.connect();
  const db = client.db(dbName);
  const dogs = db.collection("dogs");

  let res = await dogs.findOne({ _id: ObjectId("617992c2c0319b1298748fae") });
  console.log(res);

  client.close();
})();
```

### Remarquez:

- L'utilisation du `ObjectId()` comme constructeur
- Le `_id` comme membre. C'est le id généré par mongo
- Si vous faites un find sur la string `617992c2c0319b1298748fae` simple, ça ne fonctionnera pas.

## Architecture

On tente toujours de diviser correctement nos morceaux logique. La logique qui communique avec la base de données sera donc un nouveau morceaux de nos applications. Il faut comprendre qu'un domaine pourrait devoir agir avec plus d'une sorte de base de données. Son comportement et sa codification ne devrait pas en être impacté.

On va donc compartimenter, ou "wrapper" notre logique d'accès à la base de donnée. C'est ce qu'on va appeler la couche de persistance. Vous verrez aussi les mots `connectors` et/ou `repository` être utilisés pour désigner cette partie. TOUTES les actions sur la bd doivent être comprises dans cette couche et nulpart ailleurs.
