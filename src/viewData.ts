import prisma from './prisma.js';

// Function to fetch and display data
const fetchData = async (): Promise<void> => {
  try {
    // Fetch users
    const users = await prisma.user.findMany();
    console.log('Users:');
    console.table(users);

    // Fetch trains
    const trains = await prisma.train.findMany();
    console.log('Trains:');
    console.table(trains);

    // Fetch tickets
    const tickets = await prisma.ticket.findMany();
    console.log('Tickets:');
    console.table(tickets);
 
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await prisma.$disconnect(); // Close the Prisma connection
  }
};

// Run the fetchData function
fetchData();
