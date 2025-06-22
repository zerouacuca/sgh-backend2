# Dockerfile para ms-consulta
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

COPY src src

RUN ./mvnw clean package -DskipTests

EXPOSE 8083

ENTRYPOINT ["java","-jar","target/ms-consulta-0.0.1-SNAPSHOT.jar"]
