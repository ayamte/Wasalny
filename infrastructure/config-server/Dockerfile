# Stage 1: Build avec Maven officiel  
FROM maven:3.9.5-eclipse-temurin-17-alpine AS build  
WORKDIR /app  
  
# Copier uniquement pom.xml pour cacher les dépendances  
COPY pom.xml .  
  
# Télécharger les dépendances (commande corrigée)  
RUN mvn dependency:resolve dependency:resolve-plugins -B  
  
# Copier le code source et builder  
COPY src ./src  
RUN mvn clean package -DskipTests -B  
  
# Stage 2: Runtime  
FROM eclipse-temurin:17-jre-alpine  
WORKDIR /app  
  
COPY --from=build /app/target/*.jar app.jar  
  
EXPOSE 8888  
  
ENTRYPOINT ["java", "-jar", "app.jar"]