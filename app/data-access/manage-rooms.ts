interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
    BGP: string;
}

export async function editThisRoom(editRoom: Room, roomId: number){
    const response = await fetch('/api/manageRooms', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            ...editRoom, 
            RoomID: roomId 
        }),
    });
    return response;
}
  
export async function deleteRoom(roomId: number){
    const response = await fetch('/api/manageRooms', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ RoomID: roomId }),
    });
    return response;
}
  
export async function addNewRoom(newRoomName: string, newPax: number, newType: string, newStatus: string, imageUrl: string, pin: string){
    const response = await fetch('/api/manageRooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            RoomName: newRoomName,
            Pax: newPax,
            Type: newType,
            Status: newStatus,
            imagename: imageUrl,
            BGP: pin,
        }),
    });
    return response;
}

  
export async function getFeedback(roomId: number){
    const response = await fetch(`/api/viewFeedback?roomId=${roomId}`);
    return response;
}
