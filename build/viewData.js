var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from './prisma.js';
// Function to fetch and display data
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch users
        const users = yield prisma.user.findMany();
        console.log('Users:');
        console.table(users);
        // Fetch trains
        const trains = yield prisma.train.findMany();
        console.log('Trains:');
        console.table(trains);
        // Fetch tickets
        const tickets = yield prisma.ticket.findMany();
        console.log('Tickets:');
        console.table(tickets);
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
    finally {
        yield prisma.$disconnect(); // Close the Prisma connection
    }
});
// Run the fetchData function
fetchData();
