import jwt from 'jsonwebtoken';
import compression from 'compression';
// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.sendStatus(401); // Unauthorized
        return; // Since void is the return type of authenticatetoken(), split return res.sendStatus() into two lines...
    }
    // control came here => There is something as a token.. verify if it is valid token
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            res.sendStatus(403); // Forbidden
            return;
        }
        if (decoded) {
            // Type assertion to ensure `userId` and `role` are available
            req.user = decoded;
        }
        next();
    });
};
// Middleware to check admin role
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied.' });
        return;
    }
    next();
};
const compressTrainsRoute = compression({
    level: 6, // Compression level (0-9, 9 being best compression but slowest)
    threshold: '1kb', // Only compress responses that are at least 1KB in size
});
export { authenticateToken, isAdmin, compressTrainsRoute };
