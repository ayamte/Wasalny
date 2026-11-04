# syntax=docker/dockerfile:1
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,target=/root/.m2,sharing=locked mvn -B -ntp -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S wasalny && adduser -S wasalny -G wasalny
COPY --from=build --chown=wasalny:wasalny /app/target/*.jar app.jar
USER wasalny
ENV JAVA_OPTS="-Xms64m -Xmx512m -XX:+UseContainerSupport"
EXPOSE 8084
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
