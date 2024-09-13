import prisma from './prisma.js';

async function insertSeatsData() {
  try {
    // Fetch all trains and their maxSeatsAvailable
    const trains = await prisma.train.findMany({
      select: {
        trainid: true,
        maxSeatsAvailable: true,
      },
    });

    for (const train of trains) {
      const { trainid, maxSeatsAvailable } = train;

      // Generate JSON data for all seats
      const seats: Record<string, string> = {};    // Record is like a Map<Key,Value>
      for (let i = 1; i <= maxSeatsAvailable; i++) {
        seats[i.toString()] = 'not booked';
        //       Key        :    Value
      }

      // Insert or update = Upsert the seats data in the Seats table
      await prisma.seats.upsert({
        where: { trainid },
        update: { seats: seats },
        
        create: { trainid, seats },
      });

      console.log(`Seats data for train ${trainid} inserted/updated successfully.`);
    }
  } catch (error) {
    console.error('Error during insertSeatsData:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertSeatsData();