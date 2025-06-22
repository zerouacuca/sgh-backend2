# Dockerfile para API Gateway (Node.js)

FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência e instalar
COPY package*.json ./
RUN npm install

# Copiar o restante da aplicação
COPY . .

# Expõe a porta
EXPOSE 8080

# Inicia o servidor
CMD ["node", "src/index.js"]
