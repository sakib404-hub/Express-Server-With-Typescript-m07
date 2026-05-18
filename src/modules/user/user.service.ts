import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";


const createUserIntoDB = async (payLoad: IUser) => {
    const { name, email, age, password, is_active = false } = payLoad;

    const passwordHashed = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        INSERT INTO users(name, email, age, password, is_active) VALUES($1, $2, $3, $4,  $5) RETURNING *`, [name, email, age, passwordHashed, is_active]);

    //delting the password in the returning array
    delete result.rows[0].password;

    return result;
}

const getUserFromDB = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

const getSingleUserFromDB = async (id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result;
}

const deleteUserFromDB = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
    return result;
}

const updateUserInformation = async (payLoad: IUser, id: string) => {
    const { name, age, password, is_active } = payLoad;

    const result = await pool.query(`
            UPDATE users 
            SET name = COALESCE($1, name),
            age = COALESCE($2, age),
            password = COALESCE($3, password),
            is_active = COALESCE($4, is_active),
            updated_at = NOW() WHERE id = $5 RETURNING *`,
        [name, age, password, is_active, id]);
    return result;
}

export const userServices = {
    createUserIntoDB,
    getUserFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    updateUserInformation
}