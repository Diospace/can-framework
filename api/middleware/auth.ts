import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: { id: number; username: string }; // Or whatever user payload you store in the token
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use a strong secret from environment variables

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user as { id: number; username: string }; // Attach user payload to the request
        next();
    });
};