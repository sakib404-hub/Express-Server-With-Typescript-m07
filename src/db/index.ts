import {Pool} from "pg";
import config from "../config/env";

export const pool = new Pool({
    connectionString : config.connectionString
})


//? initializing the database 
export const initDB = async() =>{
    try{
        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles(
                id SERIAL PRIMARY KEY,
                user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                bio TEXT,
                address TEXT,
                phone VARCHAR(15),
                gender VARCHAR(15),

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )`)

        console.log('Database connected successfully!');
    }catch(err){
        console.log(err);
    }
}
