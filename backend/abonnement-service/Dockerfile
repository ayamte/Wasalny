# Étape 1 : Build avec image Maven officielle  
FROM maven:3.9.5-eclipse-temurin-17-alpine AS build  
WORKDIR /app  
  
# Copier uniquement pom.xml d'abord (pour cache des dépendances)  
COPY pom.xml .  
  
# Télécharger les dépendances (remplacer go-offline par resolve)  
RUN mvn dependency:resolve dependency:resolve-plugins -B  
  
# Copier le code source  
COPY src ./src  
  
# Build l'application (les dépendances sont déjà téléchargées)  
RUN mvn clean package -DskipTests -B  
  
# Étape 2 : Runtime avec JRE minimal  
FROM eclipse-temurin:17-jre-alpine  
WORKDIR /app  
  
# Copier le JAR depuis l'étape de build  
COPY --from=build /app/target/*.jar app.jar  
  
# Exposer le port (sera surchargé par docker-compose)  
EXPOSE 8080  
  
# Configuration JVM optimisée  
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport"  
  
# Démarrer l'application  
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]