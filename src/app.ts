import express, { type Application, type Request, type Response } from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";

const app : Application = express();

// this is the middleware to parse the incoming request body as JSON
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}));

//calling the user route here if route is found
app.use('/users', userRoute);
app.use('/profile', profileRoute);
app.use('/auth', authRouter);


app.get('/', (req : Request, res : Response)=>{
   // res.send('Hello World!, this is the express server running with the typescript module system : ESNext');
   res.status(200).json(
    {
        message : 'Hellow world',
        author : 'Next level'
    }
)
})



export default app;