// /aws_db/bookings.ts
import mysql from 'mysql2/promise';

export async function createFavInDB(UserID: number, RoomID: number) {
    try {
        const db = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        });

        const query = "INSERT INTO Favourite (UserID, RoomID) VALUES (?, ?)";
        const [result] = await db.execute(query, [UserID, RoomID]);

        await db.end();
        return result;
    } catch (error) {
        console.error('Error in createBookingInDB:', error);
        throw error;
    }
}
