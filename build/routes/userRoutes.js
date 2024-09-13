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
import prisma from '../prisma.js';
const router = express.Router();
// Read all users
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users.', error });
    }
}));
// Read a user by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: { userid: parseInt(id, 10) } // , 10 to make sure that the string id: "35" is interpreted as a Decimal number 35
        });
        if (!user)
            return res.status(404).json({ message: 'User not found.' });
        // If User exists... show him
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user.', error });
    }
}));
// Update a user
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, mobilenumber, gender, role } = req.body;
    if (!name && !mobilenumber && !gender && !role) {
        return res.status(400).json({ message: 'At least one field is required for update.' });
    }
    try {
        const user = yield prisma.user.update({
            where: { userid: parseInt(id, 10) },
            data: {
                name,
                mobilenumber,
                gender,
                role
            }
        });
        res.json({ message: 'User updated successfully.', user });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user.', error });
    }
}));
// Delete a user
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.user.delete({
            where: { userid: parseInt(id, 10) }
        });
        res.json({ message: 'User deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user.', error });
    }
}));
// Ask for train name using full-text search
router.get('/train/:trainName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainName } = req.params;
    if (!trainName) {
        return res.status(400).json({ message: 'TrainName is required.' });
    }
    try {
        const trains = yield prisma.train.findMany({
            where: {
                trainName: {
                    contains: trainName, // Partial match instead of FULLTEXT search
                }
            }
        });
        res.json({ results: trains });
    }
    catch (error) {
        console.error('Error Fetching Train Data:', error);
        res.status(500).json({ message: 'Error Fetching Train Data.', error });
    }
}));
// Get available seats for a train
router.get('/seats/:trainid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainid } = req.params;
    if (!trainid) {
        return res.status(400).json({ message: 'Train ID is required.' });
    }
    try {
        const seatData = yield prisma.seats.findUnique({
            where: { trainid: parseInt(trainid, 10) }
        });
        if (!seatData)
            return res.status(404).json({ message: 'Seats not found for this train.' });
        // Ensure `seats` is typed as `{ [key: string]: 'not booked' | 'booked' }`
        const seats = seatData.seats;
        const availableSeats = Object.keys(seats).filter(key => seats[key] === 'not booked');
        res.json({ availableSeats });
    }
    catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ message: 'Error fetching seats.', error });
    }
}));
// Book a ticket
router.post('/book-ticket/:trainid/:seatNo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { trainid, seatNo } = req.params;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userid;
    if (!trainid || !seatNo || !userid) {
        return res.status(400).json({ message: 'Train ID, seat number, and user ID are required.' });
    }
    try {
        // Check if the user exists
        const user = yield prisma.user.findUnique({
            where: { userid: parseInt(userid, 10) }
        });
        if (!user)
            return res.status(404).json({ message: 'User not found.' });
        // Check if the seat is available
        const seatData = yield prisma.seats.findUnique({
            where: { trainid: parseInt(trainid, 10) }
        });
        if (!seatData)
            return res.status(404).json({ message: 'Seats not found for this train.' });
        const seats = seatData.seats;
        if (seats === null || !Object.prototype.hasOwnProperty.call(seats, seatNo)) {
            return res.status(404).json({ message: 'Seat number not found.' });
        }
        if (seats[seatNo] !== 'not booked') {
            return res.status(400).json({ message: 'Seat is already booked.' });
        }
        // Update the seat status to booked
        seats[seatNo] = 'booked';
        yield prisma.seats.update({
            where: { trainid: parseInt(trainid, 10) },
            data: { seats: seats } // Typecast as 'any' if needed for Prisma
        });
        // Insert the booking into the Ticket table
        const ticket = yield prisma.ticket.create({
            data: {
                userid: parseInt(userid, 10),
                trainid: parseInt(trainid, 10),
                seatNo: parseInt(seatNo, 10)
            }
        });
        res.status(201).json({ message: 'Ticket booked successfully.', ticketId: ticket.ticketid });
    }
    catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({ message: 'Error booking ticket.', error });
    }
}));
export default router;
