import { toast } from "sonner";

export async function unlockThisUser(userID: number){
    const response = await fetch('api/unlockUser', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserID: userID,
        FailLogin: 0,
        IsLocked: false, // Assuming IsLocked is a boolean
      }),
    });
  
    if (response.ok) {
      toast.success("User has been unlocked. Do remember to inform them that their account is unlocked.");
    } else {
      console.log("Failed to unlock user");
    }
  }
  
export async function editUser(userID: number, editUsername:string, editRole: string){
    const response = await fetch('/api/manageUsers', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: userID, 
        newUsername: editUsername, 
        newRole: editRole }), // Send ID, new username, and new role
    });
    return response;
}
  
export async function deleteUser(userID: number){
    const response = await fetch('/api/manageUsers', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userID }), // Send ID for deletion
    });
    return response;
}
  
export async function addNewUser(Username: string, Password: string, Email: string, Role: string){
    const response = await fetch('/api/manageUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: Username,
        Password: Password,
        Email: Email,
        Role: Role,
        ProfilePicture: '/images/profile-icon.png', // Default profile picture
      }),
    });
    return response;
}