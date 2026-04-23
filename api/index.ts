import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import { apiRouter } from './route/routes';
import { User } from './config/User'; // Corrected path to entity at root
import { authenticateToken } from './middleware/auth';

const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; 

/**
 * TypeORM Data Source Initialization.
 * Exported so it can be used by the TypeORM CLI.
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'can_framework_db',
    synchronize: true, // WARNING: In production, use migrations instead of synchronize: true
    logging: false,
    entities: [User], // Register your entities here
    subscribers: [],
    migrations: [],
});

/**
 * Starts the API server.
 */
export function startApiServer(): express.Application {
    const app = express();

    // 1. Global Middleware
    app.use(cors()); // Enable CORS for all origins by default (for development)
    app.use(bodyParser.json()); // Parse JSON request bodies
    app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

    AppDataSource.initialize()
        .then(() => {
            console.log('Data Source has been initialized!');

            // Make AppDataSource available to routes if needed (e.g., via app.locals or custom middleware)
            app.locals.dataSource = AppDataSource;

            // 2. Mount API Routes
            // Example: Public routes
            app.use('/api/public', apiRouter);
            
            // Example: Protected routes using the new JWT middleware
            app.use('/api/private', authenticateToken, apiRouter);

            // 3. Global Error Handling Middleware
            app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.error('Unhandled API Error:', err);
                res.status(err.status || 500).json({
                    error: 'Internal Server Error',
                    message: err.message || 'Something went wrong on the server.'
                });
            });

            app.listen(PORT, () => {
                console.log(`Can Framework API server running at http://localhost:${PORT}`);
            });
        })
        .catch((error) => console.error('Error during Data Source initialization:', error));

    return app;
}

/**
 * Entry point check for both CJS and ESM environments.
 */
const isMain = () => {
    if (typeof require !== 'undefined' && require.main === module) return true;
    if (typeof import.meta !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) return true;
    
    return false;
};

if (isMain()) {
    startApiServer();
}