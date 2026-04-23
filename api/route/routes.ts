import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { User } from '../config/User'; // Corrected path
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'; // Corrected path

export const apiRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Must match the secret in index.ts

/**
 * Helper to get the TypeORM repository from the Express app locals.
 * This assumes AppDataSource is initialized and attached to app.locals.dataSource in index.ts.
 */
const getUserRepository = (req: Request) => {
    const dataSource: DataSource = (req.app as any).locals.dataSource;
    if (!dataSource) {
        throw new Error('TypeORM DataSource not initialized or not available in app.locals');
    }
    return dataSource.getRepository(User);
};

// --- Authentication Routes ---

// Mock login route - In a real app, verify credentials against a database
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Mock user verification
    if (username === 'testuser' && password === 'password123') {
        const userPayload = { id: 1, username: 'testuser' };
        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Login successful', token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Protected route example
apiRouter.get('/protected', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: `Welcome, ${req.user?.username}! This is protected data.`, user: req.user });
});

// --- User Management Routes (using TypeORM) ---

// Example: GET /api/hello
apiRouter.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Can Framework API (Express)!' });
});

// Example: POST /api/users - Create a new user
apiRouter.post('/users', async (req: Request, res: Response) => {
    const userRepository = getUserRepository(req);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const newUser = userRepository.create({ username, password }); // In real app, hash password before saving
        await userRepository.save(newUser);
        res.status(201).json({ id: newUser.id, username: newUser.username, message: 'User created successfully' });
    } catch (error: any) {
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({ error: 'Username already exists' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
});

// Example: GET /api/users - Get all users (protected)
apiRouter.get('/users', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userRepository = getUserRepository(req);
    const users = await userRepository.find({ select: ['id', 'username', 'isActive'] }); // Don't send passwords!
    res.json(users);
});

// Example: GET /api/users/:id
apiRouter.get('/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userRepository = getUserRepository(req);
    const userId = req.params.id;
    const user = await userRepository.findOne({ where: { id: parseInt(userId, 10) }, select: ['id', 'username', 'isActive'] });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

// Example: PUT /api/users/:id
apiRouter.put('/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.id;
    const updatedData = req.body;
    // In a real app, update user in DB
    res.json({ userId, ...updatedData, message: 'User updated successfully' });
});

// Example: DELETE /api/users/:id
apiRouter.delete('/users/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.id;
    // In a real app, delete user from DB
    res.json({ userId, message: 'User deleted successfully' });
});

// Example: A route that throws an error to test global error handling
apiRouter.get('/error-test', (req: Request, res: Response, next) => {
    // Simulate an async error
    setTimeout(() => {
        try {
            throw new Error('This is a simulated API error!');
        } catch (e) {
            next(e); // Pass error to the next middleware (global error handler)
        }
    }, 100);
});