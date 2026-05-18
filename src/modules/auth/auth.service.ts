import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from 'jsonwebtoken'
import config from "../../config/env";

const loginUserIntoDB = async (payLoad: { email: string, password: string }) => {

    try {

        const { email, password } = payLoad;
        // 1. first we need to check, if the user exist on the database
        // 2. compare the entered password and the existing password if the user exist
        // 3. Generate Token

        const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (userData.rows.length === 0 || userData.rowCount === 0) {
            throw new Error('Invalid Credential')
        }


        const user = userData.rows[0];

        const matchedPassword = await bcrypt.compare(password, user.password);
        console.log(matchedPassword);

        if (!matchedPassword) {
            throw new Error('Invalid Credential');
        }

        //? token generation
        const jwtPayLoad = {
            id: user.id,
            name: user.name,
            email: user.email,
            is_active: user.is_active
        }
        const accessToken = jwt.sign(jwtPayLoad, config.jwtSecret, { expiresIn: '1d' })

        return { accessToken }
    } catch (err: any) {
        throw new Error('Internal Server Error')
    }

}

export const authService = {
    loginUserIntoDB
}