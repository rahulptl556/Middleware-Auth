const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const zod = require('zod');

//Input validator using ZOD
function login(req,res,next){
    const schema = zod.object({
        email : zod.string().email(),
        password: zod.string()
        .min(5, { message: "Password must be at least 5 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[\W_]/, { message: "Password must contain at least one symbol" }),
    })
    const input = req.body;
    const response = schema.safeParse(input);
    if(response.success){
        next();
    }
    else{
        res.status(411).json({
            msg:"Invalid inputs",
            errors: response.error.errors,
        })
    }
}

app.use(express.json());

//Two Middlewares (userMiddleware & kidneyMiddleware)
            // userMiddleware
function userMiddleware(req,res,next){
    // destructuring
    const username = req.headers.username;
    const password = req.headers.password;
    // run check if username and password equal
    if(username!='Rahul' || password!='Pass'){
        res.status(403).json({
            msg:'User donot exist',
        });
    }
    else{
        next();
    }
};
        //kidneyMiddleware
function kidneyMiddleware(req,res,next){
    const kidneyId = req.query.kidneyId;   
    if(kidneyId === '1' || kidneyId === '2'){
        next();
    }
    else{
        res.status(411).json({
            msg:'Inputs invalid',
        })
    }
}


app.get('/health-checkup',userMiddleware,kidneyMiddleware,(req,res)=>{
    res.send('You are healthy');
})

app.get('/heart-checkup',userMiddleware,(req,res)=>{
    res.send('Heart is healthy');
})

app.post('/health-checkup',(req,res)=>{
    const kidneyId = req.body.kidney;
    const response = schema.safeParse(kidneyId);
    res.send(response);
})

app.post('/login',login,(req,res)=>{
    res.send('Login sucessful');
})

//Adding a global catch - error middleware
app.use((err,req,res,next)=>{
    res.json({
        msg:'Some issue on our end, Sorry!'
    })
})

app.listen(PORT);
