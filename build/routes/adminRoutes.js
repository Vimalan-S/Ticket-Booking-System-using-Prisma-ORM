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
// Route to add a new train
router.post('/add-train', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainName, maxSeatsAvailable, startLocation, endLocation } = req.body;
    // Validate required fields
    if (!trainName || maxSeatsAvailable === undefined || !startLocation || !endLocation) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        // Insert the new train using Prisma
        const train = yield prisma.train.create({
            data: {
                trainName,
                maxSeatsAvailable,
                startLocation,
                endLocation
            }
        });
        res.status(201).json({ message: 'Train added successfully.', train });
    }
    catch (error) {
        console.error('Error adding train:', error);
        res.status(500).json({ message: 'Error adding train.', error });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
export default router;
