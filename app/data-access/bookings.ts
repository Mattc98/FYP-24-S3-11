import { toast } from "sonner";

export async function overrideBooking(roomName: string, bookingID: number, newUserId: string,  sgNewDate: string, new24Time:string, username:string, oldUserID:string){
    console.log('overrideBooking', bookingID);
    
    const overrideResponse = await fetch('/api/overrideBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bookingID: bookingID,
            sgNewDate,
            new24Time,
            newUserId,
        }),
    });

    const overrideData = await overrideResponse.json();
    if (!overrideData.success) {
        alert('Failed to create new booking.');
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
                    bookingDate: sgNewDate,
                    bookingTime: new24Time,
                    directorName: username,
                }),
            });
        } else {
            console.error('Failed to retrieve user email');
        }
}

export async function deleteBooking(bookingId: number){
    const response = await fetch('/api/deleteBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
    });
    return response.json();
}

export async function amendBooking(bookingID: number, sgNewDate: string, new24Time:string, roomName: string){
    const response = await fetch('/api/amendBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bookingId: bookingID,
            sgNewDate: sgNewDate,
            new24Time: new24Time,
        }),
    });
    
    if (response.ok) {
        toast.success(`Room: ${roomName} on ${sgNewDate} at ${new24Time} has been booked!`);
    } else {
        alert('Failed to create booking.');
        const errorData = await response.json();
        console.log('Error response data:', errorData);
    }
}