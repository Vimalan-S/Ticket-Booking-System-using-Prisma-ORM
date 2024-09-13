import prisma from './prisma.js'; // Ensure the correct path to prisma.ts

// Define a type for Train data
interface TrainData {
  trainName: string;
  maxSeatsAvailable: number;
  startLocation: string;
  endLocation: string;
}

// Function to generate random train data with strict type return
function generateRandomTrainData(index: number): TrainData {
  const trainNames: string[] = ['Express', 'Superfast', 'Mail', 'Passenger', 'Intercity'];
  const locations: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

  const trainName: string = `${trainNames[Math.floor(Math.random() * trainNames.length)]}-${index}`;      // Express-284
  const maxSeatsAvailable: number = Math.floor(Math.random() * (300 - 100 + 1)) + 100;        // Random seats between 100-300
  const startLocation: string = locations[Math.floor(Math.random() * locations.length)];
  
  let endLocation: string = locations[Math.floor(Math.random() * locations.length)];
  
  // Ensure start and end locations are not the same
  while (startLocation === endLocation) {
    endLocation = locations[Math.floor(Math.random() * locations.length)];
  }

  return { trainName, maxSeatsAvailable, startLocation, endLocation };
}

// Function to generate and insert 250 rows into the Train table
async function generateTrainData(): Promise<void> {
  try {
    // Generate train data
    const trains: TrainData[] = [];
    for (let i = 1; i <= 250; i++) {
      trains.push(generateRandomTrainData(i));
    }

    // Insert the train data into the Train table in bulk
    await prisma.train.createMany({
      data: trains,
    });

    console.log('Train data inserted successfully');
  } catch (error) {
    console.error('Error inserting train data:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma Client
  }
}

// Run the data generation function
generateTrainData();
