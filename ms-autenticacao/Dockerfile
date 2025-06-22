# Use imagem base do OpenJDK 17 com Maven para build
FROM maven:3.9.0-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Builda o projeto e empacota jar
RUN mvn clean package -DskipTests

# Segunda etapa: imagem menor para rodar o jar
FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY --from=build /app/target/ms-ms_autenticacao-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java","-jar","app.jar"]
