import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

// Define types for the JWT payload
interface UserPayload extends JwtPayload {
  userId: string;
  role: 'admin' | 'regular';
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

// Middleware to verify JWT and extract user info
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.sendStatus(401); // Unauthorized
    return;    // Since void is the return type of authenticatetoken(), split return res.sendStatus() into two lines...
  }

  // control came here => There is something as a token.. verify if it is valid token
  jwt.verify(token, 'your_jwt_secret', (err: VerifyErrors | null, decoded: JwtPayload | undefined | string) => {
    if (err) {
      res.sendStatus(403); // Forbidden
      return;
    }

    if (decoded) {
      // Type assertion to ensure `userId` and `role` are available
      req.user = decoded as UserPayload;
    }
    
    next();
  });
};

// Middleware to check admin role
const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const user = req.user as UserPayload;

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied.' });
    return;
  }

  next();
};

export { authenticateToken, isAdmin };
