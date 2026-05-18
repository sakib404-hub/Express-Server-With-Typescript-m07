import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async(req : Request , res : Response)=>{
    try{
        const body = req.body;

        const result = await profileService.createProfileIntoDB(body);

       res.status(200).json({
        success : true, 
        message : 'User profile  created successfully',
        data : result.rows[0]
       })

    }catch(err : any){
        
        res.status(500).json({
            success : false,
            message : err.message,
            error : err
        })
    }

}

export const profileController = {
    createProfile,
}