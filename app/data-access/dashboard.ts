import { toast } from 'sonner';

export async function overrideBooking(bookingID: number, userID: number, oldUserID: string, roomName: string, bookingDate: string, bookingTime:string, username:string){
    const updateResponse = await fetch('/api/updateUserID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bookingId: bookingID,
            newUserId: userID,
        }),
    });

    const updateData = await updateResponse.json();
    if (!updateResponse.ok || !updateData.success) {
        console.error('Failed to update UserID:', updateData.error);
        alert('Failed to override booking.');
        return;
    }

    const userResponse = await fetch(`/api/getEmailById?userId=${oldUserID}`);
        const userData = await userResponse.json();

        if (userResponse.ok && userData.email) {
            await fetch('/api/sendNotificationEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    roomName: roomName,
                    bookingDate: bookingDate,
                    bookingTime: bookingTime,
                    directorName: username,
                }),
            });
        } else {
            console.error('Failed to retrieve user email');
        }
}

export async function createBooking(RoomID: number, UserID: number, bookingDate: string, bookingTime: string, RoomPin: string, BGP: string, RoomName: string, selectedTimeSlot: string){
    const response = await fetch('/api/createBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            RoomID: RoomID,
            UserID: UserID,
            BookingDate: bookingDate,
            BookingTime: bookingTime,
            RoomPin: RoomPin,
            BGP: BGP,
        }),
    });
    
    if (response.ok) {
        toast.success(`Room: ${RoomName} on ${bookingTime} at ${selectedTimeSlot} has been booked!`);
    } else {
        alert('Failed to create booking.');
        const errorData = await response.json();
        console.log('Error response data:', errorData);
    }
}

export async function favRoom(isFavorite: boolean, UserID: number, RoomID: number){
    const response = await fetch('/api/updateFavourites', {
        method: isFavorite ? 'DELETE' : 'POST', // Use DELETE to remove, POST to add
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            UserID: UserID,
            RoomID: RoomID,
        }),
    });

    if (response.ok) {
        return !isFavorite // Toggle favorite state
    }
    return isFavorite;
}