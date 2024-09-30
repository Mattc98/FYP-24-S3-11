// /aws_db/bookings.ts
import mysql from 'mysql2/promise';

export async function createBookingInDB(RoomID: number, UserID: number, BookingDate: string, BookingTime: string, RoomPin: string) {
    try {
        const db = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        });

        const query = `INSERT INTO Booking (RoomID, UserID, BookingDate, BookingTime, RoomPin) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [RoomID, UserID, BookingDate, BookingTime, RoomPin]);

        await db.end();
        return result;
    } catch (error) {
        console.error('Error in createBookingInDB:', error);
        throw error;
    }
}
