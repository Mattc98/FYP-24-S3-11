const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
};

exports.handler = async (event, context) => {
    const { httpMethod, headers } = event;

    // Add CORS headers
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'CORS check' }),
        };
    }

    // Parse request body
    const body = JSON.parse(event.body);

    try {
        const connection = await mysql.createConnection(dbConfig);

        if (httpMethod === 'POST') {
            const { RoomName, Pax, Type, Status, imagename, BGP } = body;

            const base64Data = imagename.split(',')[1];
            const extension = imagename.split(';')[0].split('/')[1];
            const imagePath = path.join(process.cwd(), 'public', 'images', `${RoomName}.${extension}`);
            fs.writeFileSync(imagePath, base64Data, 'base64');

            const query = `
                INSERT INTO Room (RoomName, Pax, Type, Status, imagename, BGP)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await connection.execute(query, [RoomName, Pax, Type, Status, `${RoomName}.${extension}`, BGP]);

            const [rows] = await connection.execute('SELECT * FROM Room WHERE RoomName = ?', [RoomName]);
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(rows[0]),
            };
        }

        // Other HTTP methods implementation here...

        await connection.end();
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ message: 'Error processing request', error: error.message }),
        };
    }
};
