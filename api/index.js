"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
exports.startApiServer = startApiServer;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeorm_1 = require("typeorm");
const routes_1 = require("./route/routes");
const User_1 = require("./config/User"); // Corrected path to entity at root
const auth_1 = require("./middleware/auth");
const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
/**
 * TypeORM Data Source Initialization.
 * Exported so it can be used by the TypeORM CLI.
 */
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'can_framework_db',
    synchronize: true, // WARNING: In production, use migrations instead of synchronize: true
    logging: false,
    entities: [User_1.User], // Register your entities here
    subscribers: [],
    migrations: [],
});
/**
 * Starts the API server.
 */
function startApiServer() {
    const app = (0, express_1.default)();
    // 1. Global Middleware
    app.use((0, cors_1.default)()); // Enable CORS for all origins by default (for development)
    app.use(body_parser_1.default.json()); // Parse JSON request bodies
    app.use(body_parser_1.default.urlencoded({ extended: true })); // Parse URL-encoded request bodies
    exports.AppDataSource.initialize()
        .then(() => {
        console.log('Data Source has been initialized!');
        // Make AppDataSource available to routes if needed (e.g., via app.locals or custom middleware)
        app.locals.dataSource = exports.AppDataSource;
        // 2. Mount API Routes
        // Example: Public routes
        app.use('/api/public', routes_1.apiRouter);
        // Example: Protected routes using the new JWT middleware
        app.use('/api/private', auth_1.authenticateToken, routes_1.apiRouter);
        // 3. Global Error Handling Middleware
        app.use((err, req, res, next) => {
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
    if (typeof require !== 'undefined' && require.main === module)
        return true;
    if (typeof import.meta !== 'undefined' && import.meta.url === `file://${process.argv[1]}`)
        return true;
    return false;
};
if (isMain()) {
    startApiServer();
}
