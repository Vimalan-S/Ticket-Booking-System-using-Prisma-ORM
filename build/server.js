var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { authenticateToken, isAdmin } from './middleware/authMiddleware.js';
const app = express();
app.use(express.json());
// Registration route
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, role, mobilenumber, gender } = req.body;
    if (!name || !password || !role) {
        return res.status(400).json({ message: 'Name, password, and role are required.' });
    }
    // Hash the password... Since ur registering just now...
    try {
        const hashedPassword = yield bcrypt.hash(password, 10);
        // Put that into Database: User table
        yield prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                mobilenumber,
                gender,
                role,
            },
        });
        res.status(201).json({ message: 'User created successfully.' });
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Error creating user.', err });
    }
}));
// Login route
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required.' });
    }
    try {
        // Check if that username exists in the registered Table: User
        const user = yield prisma.user.findUnique({
            where: { name },
        });
        // If user has not registered...
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // control came here => Compare the entered pwd with Hashed pwd
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Since passwords matched, sign JWT token with userid, role
        const token = jwt.sign({ userid: user.userid.toString(), name: user.name, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        // Send the token as part of login response
        res.json({ token });
    }
    catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Error logging in.', err });
    }
}));
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/admin', authenticateToken, isAdmin, adminRoutes);
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
