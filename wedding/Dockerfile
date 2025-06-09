# Etapa 1: Construcción del proyecto
FROM maven:3.9.9-eclipse-temurin-17 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia todos los archivos al contenedor
COPY . .

# Da permisos de ejecución al wrapper de Maven
RUN chmod +x mvnw

# Construye el proyecto, sin correr los tests
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen ligera para ejecutar la app
FROM eclipse-temurin:17-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo .jar generado en la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Expone el puerto donde corre la app
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
