import express, { Request, Response } from 'express';
import prisma from '../prisma.js';
import { Gender, Role } from '@prisma/client';      // bcz I have given them as Enums in prisma.schema

const router = express.Router();

// Define interfaces for request bodies and parameters
interface UpdateUserRequestBody {
  name?: string;
  mobilenumber?: string;
  gender?: Gender;     
  role?: Role;
}

interface UserIdParams {
  id: string;
}

interface Seats {
  [key: string]: 'not booked' | 'booked';     // [key]:value
  // ie., Key can be any string.... but Value can be either not booked/booked
}

// Read all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.', error });
  }
});

// Read a user by ID
router.get('/:id', async (req: Request<UserIdParams>, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { userid: parseInt(id, 10) }   // , 10 to make sure that the string id: "35" is interpreted as a Decimal number 35
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    // If User exists... show him
    res.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user.', error });
  }
});

// Update a user
router.put('/:id', async (req: Request<UserIdParams, {}, UpdateUserRequestBody>, res: Response) => {
  const { id } = req.params;
  const { name, mobilenumber, gender, role } = req.body;

  if (!name && !mobilenumber && !gender && !role) {
    return res.status(400).json({ message: 'At least one field is required for update.' });
  }

  try {
    const user = await prisma.user.update({
      where: { userid: parseInt(id, 10) },
      data: {
        name,
        mobilenumber,
        gender,
        role
      }
    });
    res.json({ message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user.', error });
  }
});

// Delete a user
router.delete('/:id', async (req: Request<UserIdParams>, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { userid: parseInt(id, 10) }
    });

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user.', error });
  }
});

// Ask for train name using full-text search
router.get('/train/:trainName', async (req: Request<{ trainName: string }>, res: Response) => {
  const { trainName } = req.params;

  if (!trainName) {
    return res.status(400).json({ message: 'TrainName is required.' });
  }

  try {
    const trains = await prisma.train.findMany({
      where: {
        trainName: {
          contains: trainName, // Partial match instead of FULLTEXT search
        }
      }
    });
    res.json({ results: trains });
  } catch (error) {
    console.error('Error Fetching Train Data:', error);
    res.status(500).json({ message: 'Error Fetching Train Data.', error });
  }
});

// Get available seats for a train
router.get('/seats/:trainid', async (req: Request<{ trainid: string }>, res: Response) => {
  const { trainid } = req.params;
  
  if (!trainid) {
    return res.status(400).json({ message: 'Train ID is required.' });
  }

  try {
    const seatData = await prisma.seats.findUnique({
      where: { trainid: parseInt(trainid, 10) }
    });

    if (!seatData) return res.status(404).json({ message: 'Seats not found for this train.' });

    // Ensure `seats` is typed as `{ [key: string]: 'not booked' | 'booked' }`
    const seats: Seats = seatData.seats as Seats;
    const availableSeats = Object.keys(seats).filter(key => seats[key] === 'not booked');
    res.json({ availableSeats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ message: 'Error fetching seats.', error });
  }
});

// Book a ticket
router.post('/book-ticket/:trainid/:seatNo', async (req: Request<{ trainid: string, seatNo: string }>, res: Response) => {
  const { trainid, seatNo } = req.params;
  const userid = (req as any).user?.userid;

  if (!trainid || !seatNo || !userid) {
    return res.status(400).json({ message: 'Train ID, seat number, and user ID are required.' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { userid: parseInt(userid, 10) }
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Check if the seat is available
    const seatData = await prisma.seats.findUnique({
      where: { trainid: parseInt(trainid, 10) }
    });

    if (!seatData) return res.status(404).json({ message: 'Seats not found for this train.' });

    const seats: Seats = seatData.seats as Seats;

    if (seats === null || !Object.prototype.hasOwnProperty.call(seats, seatNo)) {
      return res.status(404).json({ message: 'Seat number not found.' });
    }

    if (seats[seatNo] !== 'not booked') {
      return res.status(400).json({ message: 'Seat is already booked.' });
    }

    // Update the seat status to booked
    seats[seatNo] = 'booked';
    
    await prisma.seats.update({
      where: { trainid: parseInt(trainid, 10) },
      data: { seats: seats as any }       // Typecast as 'any' if needed for Prisma
    });

    // Insert the booking into the Ticket table
    const ticket = await prisma.ticket.create({
      data: {
        userid: parseInt(userid, 10),
        trainid: parseInt(trainid, 10),
        seatNo: parseInt(seatNo, 10)
      }
    });

    res.status(201).json({ message: 'Ticket booked successfully.', ticketId: ticket.ticketid });
  } catch (error) {
    console.error('Error booking ticket:', error);
    res.status(500).json({ message: 'Error booking ticket.', error });
  }
});


export default router;
