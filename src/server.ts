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



app.get('/', (req : Request, res : Response)=>{
   // res.send('Hello World!, this is the express server running with the typescript module system : ESNext');

   res.status(200).json(
    {
        message : 'Hellow world',
        author : 'Next level'
    }
   )
})

app.get('/users', (req: Request, res: Response)=>{

    res.status(200).json({
        message : 'successfully fetched the users data',
        users : [
            {
                id : 1,
                name : 'John Doe',
                email : 'john.doe@example.com'
            }
        ]
    });
})

app.post("/", async(req : Request, res : Response)=>{

    const {name, organization, password} = req.body;

    res.status(201).json({
        message : 'User created successfully',
        data : {
            name,
            organization
        }
    })

})

app.listen(port, ()=>{
    console.log(`This app is listening from port number : ${port}`);
})