import { getRooms } from '@/app/data-access/rooms';

interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  Type: string;
  BGP: string;
}

interface userRoleProps{
  UserRole: string;
}

const RoomDropdown: React.FC<userRoleProps> = async ({ UserRole }) => {  
  const rooms:Room[] = await getRooms();

  return (
    <select name="rooms" id="rooms" style={{ color: 'black' }} required>
      <option value="">Select a room</option>
      {rooms.filter((room) => UserRole === "Director" || room.Type === "User")
        .map((room) => (
          <option key={room.RoomID} value={`${room.RoomID}:${room.RoomName}`}>
            {room.RoomName}
          </option>
      ))}
    </select>
  );
}

export default RoomDropdown;