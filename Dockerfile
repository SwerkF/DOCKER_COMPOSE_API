FROM node:18

WORKDIR /app

RUN npm cache clean --force

COPY package*.json ./

RUN npm install

RUN npm uninstall bcrypt
RUN npm install bcryptjs

RUN npm install --save-dev @types/jsonwebtoken typescript

# Copy source code
COPY . .

RUN npm run build

RUN ls -la dist/

EXPOSE 8080

CMD ["npm", "start"]