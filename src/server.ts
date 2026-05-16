import express, { type Application, type Request, type Response } from "express";
import {Pool} from "pg";
import dotenv from "dotenv";
dotenv.config();

const app : Application = express();
const port = 5001;

// this is the middleware to parse the incoming request body as JSON
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}));


const pool = new Pool({
    connectionString : `postgresql://neondb_owner:${process.env.NEON_DB_PASS}@ep-weathered-frost-aqohlb74-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
})


//? initializing the database 

const initDB = async() =>{
    try{
        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(20),
                email VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `)

        console.log('Database connected successfully!');
    }catch(err){
        console.log(err);
    }
}
initDB();



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
            UPDATE users SET name = $1, age = $2, password = $3, is_active = $4, updated_at = NOW() WHERE id = $5 RETURNING *`, [name,age, password, is_active, id]);
        
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

app.listen(port, ()=>{
    console.log(`This app is listening from port number : ${port}`);
})