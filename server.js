const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
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
    const kidney = req.body.kidney;
    const length = kidney.length;
    res.send("length is " + length);
})


//Adding a global catch - error middleware
app.use((err,req,res,next)=>{
    res.json({
        msg:'Some issue on our end, Sorry!'
    })
})

app.listen(PORT);
