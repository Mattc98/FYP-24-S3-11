import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { Booking, Favourite, Room} from '@/aws_db/schema';


interface RoomDetails {
    RoomID: number;
    RoomName: string;
    Pax: number;
    imagename: string; // Image filename or URL
    BGP: string;
} 

export async function getRooms(){
    try {
      const rooms = await db.select().from(Room);
      return JSON.parse(JSON.stringify(rooms));
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
}

export async function getFavRooms(){
    try {
        const favRooms = await db.select().from(Favourite);
        return JSON.parse(JSON.stringify(favRooms));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch room data.');
    }
}

export async function getUserFavList(userID: number){
      const userFavList = await db.select({
        RoomID: Room.RoomID,
        RoomName: Room.RoomName,
        Pax: Room.Pax,
        imagename: Room.imagename,
        BGP: Room.BGP,
      }).from(Favourite).rightJoin(Room, eq(Favourite.RoomID, Room.RoomID))
      .where(eq(Favourite.UserID, userID));
      return (userFavList as RoomDetails[]);
}

export async function getBookings(){
    try {
        const bookings = await db.select().from(Booking);
        return JSON.parse(JSON.stringify(bookings));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch room data.');
    }
}