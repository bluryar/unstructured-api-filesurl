# Unstructured API Nuxt Wrapper

## Usage Steps

Before starting the Docker container services, please follow these steps:

1. **Create a `.env` File**: Create a new `.env` file in the root directory of the project to store the configuration information for Unstructured API.

2. **Add Configuration Information**: Add the following content to the `.env` file, replacing `your_unstructured_host` and `your_unstructured_api_key` with the actual HOST and API_KEY values:

   ```
   UNSTRUCTURED_API_HOST=your_unstructured_host
   UNSTRUCTURED_API_KEY=your_unstructured_api_key
   ```

   For example:
   ```
   UNSTRUCTURED_API_HOST=https://api.unstructured.io
   UNSTRUCTURED_API_KEY=abc123def456
   ```

3. **Start Docker Containers**: Use the following commands to start the containers as needed:

   - To start only this project:
     ```bash
     docker-compose up
     ```
   - To start the Unstructured API service along with this project:
     ```bash
     docker-compose -f docker-compose-full.yaml up
     ```

4. **Access the Application**: After starting the containers, access the application via the exposed port (default `http://localhost:3000`).

## Quick Start with Docker

We provide a `Dockerfile` and two `docker-compose` configuration files to help you quickly launch the project.

- `docker-compose.yaml`: Starts only this project.
- `docker-compose-full.yaml`: Starts the additional Unstructured API service along with this project.

### Docker Setup

1. **Install Docker**: Make sure Docker is installed. If not installed, you can download it from the [Docker official site](https://www.docker.com/).

2. **Build the Docker Image**:
   ```bash
   docker-compose build
   ```

3. **Start the Project**: Follow the usage steps above to start the Docker containers.

## Development and Production

Code changes during development will be automatically synchronized to the Docker container. For production deployment, build and run the Docker images with the commands provided in the usage steps.

## Contributing and Licensing

Contributions and issue reports are welcome! This project is open-source and available under the [LICENSE](LICENSE).

---

Enjoy the enhanced flexibility and capabilities of the Unstructured API with this Nuxt 3 wrapper. For more information about Unstructured API, visit the [official repository](https://github.com/Unstructured-IO/unstructured-api).
