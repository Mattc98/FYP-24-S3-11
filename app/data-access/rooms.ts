import { calluser } from '@/aws_db/db';

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    imagename: string; // Image filename or URL
    BGP: string;
} 

export async function getRooms(){
    try {
      const response = await calluser("SELECT * FROM Room");
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
}

export async function getFavRooms(){
    try {
        const response = await calluser("SELECT * FROM Favourite");
        return JSON.parse(JSON.stringify(response));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch room data.');
    }
}

export async function getUserFavList(userID: number){
    const response = await calluser(`
        SELECT r.RoomID, r.RoomName, r.Pax, r.imagename, r.BGP
        FROM Favourite f 
        JOIN Room r ON f.RoomID = r.RoomID 
        WHERE f.UserID = ${userID}
      `);
      return (response as Room[]);
}

export async function getBookings(){
    try {
        const response = await calluser("SELECT * FROM Booking");
        return JSON.parse(JSON.stringify(response));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch room data.');
    }
}