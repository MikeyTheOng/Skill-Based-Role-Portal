import { createConnection } from 'mysql2/promise';

export const connection = async () => {
    try {
        const db = await createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'UserDB-spm',
            port: 3306
        });
        console.log ("Database connected");
        return db
    } catch (error) {
        console.log("Database connection use:", error);
        throw error;
    }
    
}