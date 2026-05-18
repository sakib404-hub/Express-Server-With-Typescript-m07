import express, { type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import config from "./config/env";
import { initDB, pool } from "./db";
dotenv.config();

const app : Application = express();

// this is the middleware to parse the incoming request body as JSON
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}));


app.get('/', (req : Request, res : Response)=>{
   // res.send('Hello World!, this is the express server running with the typescript module system : ESNext');

   res.status(200).json(
    {
        message : 'Hellow world',
        author : 'Next level'
    }
   )
})

app.get('/users', async(req: Request, res: Response)=>{
   try{

    const result = await pool.query(`SELECT * FROM users`);
    
     res.status(200).json({
        message : 'successfully fetched the users data',
        success : true,
        data : result.rows
    });

   }catch(err : any){
    res.status(500).json({
        message : err.message,
        success : false,
        error : err
    })
   }
})

app.get('/users/:id', async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;

        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

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
})

app.post("/users", async(req : Request, res : Response)=>{

   try{
    const {name, email, age, password} = req.body;

    const result = await pool.query(`
        INSERT INTO users(name, email, age, password) VALUES($1, $2, $3, $4) RETURNING *`, [name, email, age, password]);

    res.status(201).json({
        message : 'User created successfully',
        data : result.rows[0]
            
    })
   }catch(err : any){

    res.status(500).json({
        message : err.message,
        error : err
    })

   }
})

app.put('/users/:id', async(req : Request, res : Response)=>{
    try{
        
        const { id } = req.params;
        const {name, age, password, is_active} = req.body;

        const result = await pool.query(`
            UPDATE users 
            SET name = COALESCE($1, name),
            age = COALESCE($2, age),
            password = COALESCE($3, password),
            is_active = COALESCE($4, is_active),
            updated_at = NOW() WHERE id = $5 RETURNING *`, 
            [name,age, password, is_active, id]);
        
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
})

app.delete('/users/:id', async(req : Request, res : Response)=>{
    try{

        const { id } = req.params;

        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);

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
})

export default app;