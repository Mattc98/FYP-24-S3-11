import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { userAccount } from '@/aws_db/schema';

export async function getUserList(){
    try {
        const users = await db.select().from(userAccount);
        return JSON.parse(JSON.stringify(users));
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
}

export async function getUserInfo(username: string){
  try {
    const userInfo = await db.select({
      UserID : userAccount.UserID,
      Username : userAccount.Username,
      Email : userAccount.Email,
      Role: userAccount.Role,
    }).from(userAccount).where(eq(userAccount.Username, (username)));
    return JSON.parse(JSON.stringify(userInfo));
  } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
  }
}