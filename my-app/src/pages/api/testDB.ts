import type { NextApiRequest, NextApiResponse } from 'next'
import { createConnection } from 'mysql2/promise';
// import { db } from '../../utils/database' 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'UserDB-spm',
        port: 3306
    });
    if(req.method==='POST'){
        try{
            const result = await db.execute("SELECT * FROM user where email = 'hrone.eams@gmail.com'");  
            console.log("result", result[0]);
            res.status(200).json({ users: result[0] });
            // Check the result to ensure the record was created successfully.
        } catch (err) {
            res.status(400).json({error: err})
        }
    }
}
