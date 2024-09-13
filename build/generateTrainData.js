var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from './prisma.js'; // Ensure the correct path to prisma.ts
// Function to generate random train data with strict type return
function generateRandomTrainData(index) {
    const trainNames = ['Express', 'Superfast', 'Mail', 'Passenger', 'Intercity'];
    const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const trainName = `${trainNames[Math.floor(Math.random() * trainNames.length)]}-${index}`; // Express-284
    const maxSeatsAvailable = Math.floor(Math.random() * (300 - 100 + 1)) + 100; // Random seats between 100-300
    const startLocation = locations[Math.floor(Math.random() * locations.length)];
    let endLocation = locations[Math.floor(Math.random() * locations.length)];
    // Ensure start and end locations are not the same
    while (startLocation === endLocation) {
        endLocation = locations[Math.floor(Math.random() * locations.length)];
    }
    return { trainName, maxSeatsAvailable, startLocation, endLocation };
}
// Function to generate and insert 250 rows into the Train table
function generateTrainData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate train data
            const trains = [];
            for (let i = 1; i <= 250; i++) {
                trains.push(generateRandomTrainData(i));
            }
            // Insert the train data into the Train table in bulk
            yield prisma.train.createMany({
                data: trains,
            });
            console.log('Train data inserted successfully');
        }
        catch (error) {
            console.error('Error inserting train data:', error);
        }
        finally {
            yield prisma.$disconnect(); // Disconnect the Prisma Client
        }
    });
}
// Run the data generation function
generateTrainData();
