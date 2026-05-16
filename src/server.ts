import express, { type Application, type Request, type Response } from "express";

const app : Application = express();
const port = 5001;

app.get('/', (req, res)=>{
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

app.listen(port, ()=>{
    console.log(`This app is listening from port number : ${port}`);
})