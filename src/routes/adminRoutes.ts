import express, { Request, Response } from 'express';
import prisma from '../prisma.js';

const router = express.Router();


// Define the request body type for adding a new train
interface AddTrainRequestBody {
  trainName: string;
  maxSeatsAvailable: number;
  startLocation: string;
  endLocation: string;
}

// Route to add a new train
router.post('/add-train', async (req: Request<{}, {}, AddTrainRequestBody>, res: Response) => {
  const { trainName, maxSeatsAvailable, startLocation, endLocation } = req.body;

  // Validate required fields
  if (!trainName || maxSeatsAvailable === undefined || !startLocation || !endLocation) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Insert the new train using Prisma
    const train = await prisma.train.create({
      data: {
        trainName,
        maxSeatsAvailable,
        startLocation,
        endLocation
      }
    });
    res.status(201).json({ message: 'Train added successfully.', train });
  } catch (error) {
    console.error('Error adding train:', error);
    res.status(500).json({ message: 'Error adding train.', error });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
