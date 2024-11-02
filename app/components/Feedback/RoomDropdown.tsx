import { calluser } from '@/aws_db/db';

interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  Type: string;
  Status: string;
}

interface userRoleProps{
  UserRole: string;
}

async function fetchRoomData(): Promise<Room[]> {
  try {
    const response = await calluser("SELECT * FROM Room");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error('Failed to fetch room data:', error);
    return [];
  }
}

const RoomDropdown: React.FC<userRoleProps> = async ({ UserRole }) => {  
  const rooms = await fetchRoomData();

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