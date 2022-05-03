# reseau-social-app backend

## Project setup
```
npm install
```

### Configuration connexion base de donnée
```
renseigner les champs dans le fichier config/config.json avec vos propres paramètres de connexion à votre serveur MySQL.
Seule l'option dévelopment est à remplir.
```

#### Création de la base de donnée
```
En ligne de commande faire : 

1- sequelize db:create
2- sequelize db:migrate
```

##### Execution du code
```
En ligne de commande faire : 

nodemon server OU npm run server
```