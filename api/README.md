# API Module

This directory contains the backend API for the Can Framework application. It leverages Express.js to provide a robust and scalable API server that can serve data to your frontend components.

## Structure

- **`index.ts`**: The main entry point for the API server. It initializes an Express application, sets up global middleware (CORS, body parsing), and mounts the API routes.
- **`routes.ts`**: Defines all API endpoints using an `express.Router()`. This is where you add your application-specific API logic.

## Usage

To manage and run the API server, use the following commands:

- **`npm run api`**: Builds the API using the framework's build tool and runs the production bundle.
- **`npm run api:dev`**: Runs the API directly from source using `ts-node` for faster development.
- **`npm run schema:sync`**: Uses the TypeORM CLI to synchronize the database schema with your entities.

## Key Features
- **Express.js Integration**: Leverages the popular Express.js framework for robust routing, middleware, and request/response handling.
- **CORS Enabled**: Configured using `cors` middleware for flexible cross-origin requests during development.
- **Body Parsing**: Automatically parses JSON and URL-encoded request bodies.
- **Structured Routing**: Uses `express.Router()` for organizing API endpoints.
- **Global Error Handling**: Includes a global Express error handler to catch and report unhandled exceptions gracefully.
- **Dynamic Routes**: Supports route parameters (e.g., `/users/:id`).