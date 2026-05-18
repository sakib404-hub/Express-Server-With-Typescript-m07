import type { Request, Response } from "express";
import { pool } from "../../db";
import { userServices } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, age, password } = req.body;

        const result = await userServices.createUserIntoDB({ name, email, age, password });

        res.status(201).json({
            message: 'User created successfully',
            data: result.rows[0]

        })
    } catch (err: any) {

        res.status(500).json({
            message: err.message,
            error: err
        })
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {

       const result = await userServices.getUserFromDB();

        res.status(200).json({
            message: 'successfully fetched the users data',
            success: true,
            data: result.rows
        });

    } catch (err: any) {
        res.status(500).json({
            message: err.message,
            success: false,
            error: err
        })
    }
}

const getSingleUser = async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;

        const result = await userServices.getSingleUserFromDB(id as string);

        if(result.rows.length === 0){
            res.status(404).json({
                message : `User with id : ${id} is not found`,
                success : false
            })
        } 

        res.status(200).json({
            message : `successfully fetched the user with id : ${id}`,
            success : true,
            data : result.rows[0]
        })

    }catch(err : any){
        res.status(500).json({
        message : err.message,
        success : false,
        error : err
    }) 
    }
}

const deleteUser =  async(req : Request, res : Response)=>{
    try{

        const { id } = req.params;

        const result = await userServices.deleteUserFromDB(id as string);

        if(result.rows.length === 0){
            res.status(404).json({
                message : `User with id : ${id} is not found`,
                success : false
            })
        }

        res.status(200).json({
            message : `User with id : ${id} is deleted successfully`,
            success : true,
            data : result.rows[0]
        })

    }catch(err : any){
        res.status(500).json({
            message : err.message,
            error : err
        })
    }
}

const updateUserInformation = async(req : Request, res : Response)=>{
    try{
        
        const { id } = req.params;

        const result = await userServices.updateUserInformation(req.body, id as string);
        
        if(result.rows.length === 0){
            res.status(404).json({
                message : `User with id : ${id} is not found`,
                success : false
            })
        }
        res.status(200).json({
            message : `User with id : ${id} is updated successfully`,
            success : true,
            data : result.rows[0]
        })

    }catch(err : any){
        res.status(500).json({
            message : err.message,
            error : err
        })
    }
}

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUserInformation
}