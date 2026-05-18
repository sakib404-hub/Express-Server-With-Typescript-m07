import type { Request, Response } from "express"
import { authService } from "./auth.service"


const loginUser = async (req: Request, res: Response) => {
    try {

        const body = req.body;

        const result = await authService.loginUserIntoDB(body);

        res.status(200).json({
            success: true,
            messagge: 'User login successful',
            data: result
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err
        })
    }
}

export const authController = {
    loginUser
}