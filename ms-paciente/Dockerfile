# Etapa 1: build do projeto
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copia o projeto inteiro
COPY . .

# Faz o build e empacota o jar
RUN mvn clean package -DskipTests

# Etapa 2: imagem de produção
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copia o JAR gerado da etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta usada no application.properties
EXPOSE 8081

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]