# Timelesstech Korea App

This is a reactjs application

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 18 or higher)
- TypeScript
- Docker

## Getting Started

```shell
git clone <repository_url>

npm install

npm run start

# Build the Docker containers
docker-compose build

# Run the Docker containers
docker-compose up -d

# Build & Run the Docker containers detach mode
docker-compose up --build -d

####CI/CD####

# Build & Run the Docker containers detach mode with tagging
docker-compose -p astro_ace build

# Docker container tagging
docker tag astro_ace_app astro_ace_app:1.0

# Run Docker container
docker run -p 3000:3000 -d astro_ace_app:1.0
```
