# Projet7

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

### Création de la base de donnée
```
En ligne de commande faire : 

1- npx sequelize-cli db:create
2- npx sequelize-cli db:migrate
```

### Mise en place variables environnement
```
Crée un fichier .env dans votre dossier racine du projet

1- Ajouter la ligne        JWT_SIGN_SECRET=       avec un code pour la signature du token.
```
### Execution du code
```
En ligne de commande faire : 

nodemon server OU npm run server
```
---------------------------------------------------------------------------------------------------------

# reseau-social-app frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
