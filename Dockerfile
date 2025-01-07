FROM node:18

# Workdir
WORKDIR /app

# Effacer le cache
RUN npm cache clean --force

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer bcryptjs pour qu'il soit installer sous Linux et non Windows
RUN npm uninstall bcrypt
RUN npm install bcryptjs

# Installer les types de jsonwebtoken et typescript car elles ne s'installent pas dans le package.json
RUN npm install --save-dev @types/jsonwebtoken typescript

# Copier le reste des fichiers
COPY . .

# Build l'app
RUN npm run build

# Exposer le port 8080
EXPOSE 8080

# Commande pour lancer l'app
CMD ["npm", "start"]