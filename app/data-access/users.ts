import { calluser } from '@/aws_db/db';

export async function getUserList(){
    try {
        const response = await calluser("SELECT * FROM userAccount");
        return JSON.parse(JSON.stringify(response));
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
}