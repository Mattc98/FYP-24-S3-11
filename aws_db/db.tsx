import mysql from ‘mysql/promise’;

import { ProductsProps } from ‘./definitions’; 

export async function callProducts(query: string, data: ProductsProps[]) {

try {

    const db = await mysql.createConnection({

    host: process.env.MYSQL_HOST,

    port: process.env.MYSQL_PORT,

    database: process.env.MYSQL_DATABASE,

    user: process.env.MYSQL_USER,

    password: process.env.MYSQL_PASSWORD

})

const [result] = await db.execute(query, data);

    await db.end();

    return result;

    } catch (error) {

    console.log(error);

    return error;

    }

}