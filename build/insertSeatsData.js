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
function insertSeatsData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch all trains and their maxSeatsAvailable
            const trains = yield prisma.train.findMany({
                select: {
                    trainid: true,
                    maxSeatsAvailable: true,
                },
            });
            for (const train of trains) {
                const { trainid, maxSeatsAvailable } = train;
                // Generate JSON data for all seats
                const seats = {}; // Record is like a Map<Key,Value>
                for (let i = 1; i <= maxSeatsAvailable; i++) {
                    seats[i.toString()] = 'not booked';
                    //       Key        :    Value
                }
                // Insert or update = Upsert the seats data in the Seats table
                yield prisma.seats.upsert({
                    where: { trainid },
                    update: { seats: seats },
                    create: { trainid, seats },
                });
                console.log(`Seats data for train ${trainid} inserted/updated successfully.`);
            }
        }
        catch (error) {
            console.error('Error during insertSeatsData:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
insertSeatsData();
