# STAGE 1: The "Builder" - Compiles our Java code
# We use an official Maven image which includes the JDK
FROM maven:3.9-eclipse-temurin-17 AS builder

# Set the working directory for the build
WORKDIR /build

# Copy the parent pom.xml first
COPY pom.xml .

# Copy the backend module's pom.xml
COPY MadAbroad-Backend/pom.xml ./MadAbroad-Backend/

# Run Maven to download all dependencies. This is done as a separate
# step to take advantage of Docker's layer caching.
RUN mvn -f MadAbroad-Backend/pom.xml dependency:go-offline

# Now copy the backend's source code
COPY MadAbroad-Backend/src ./MadAbroad-Backend/src

# Finally, build the application. This runs from the context of the root pom.
RUN mvn -f MadAbroad-Backend/pom.xml clean package -DskipTests


# STAGE 2: The "Final Image" - Creates our lean production image
# We start from a much smaller image that only contains the Java Runtime
FROM eclipse-temurin:17-jre-jammy

# Set the working directory inside the final container
WORKDIR /app

# The directory for uploaded files, used in application.properties
ARG UPLOAD_DIR=/app/uploads
# Create the uploads directory and set permissions
RUN mkdir -p ${UPLOAD_DIR} && chown -R 10001:0 ${UPLOAD_DIR} && chmod -R 775 ${UPLOAD_DIR}

# Create a non-privileged user for security best practices
ARG UID=10001
RUN adduser --disabled-password --gecos "" --home "/nonexistent" --shell "/sbin/nologin" --no-create-home --uid "${UID}" appuser
USER appuser

# Copy ONLY the compiled .jar file from the 'builder' stage into our final image
COPY --from=builder /build/MadAbroad-Backend/target/*.jar app.jar

# Expose the port that the application runs on
EXPOSE 8080

# The command to execute when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]