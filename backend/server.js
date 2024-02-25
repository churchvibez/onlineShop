const express = require('express')
const routes = require('./routes/route')
const userRoutes = require('./routes/userRoutes')
const userPatch = require('./routes/userPatch')
const app = express()
const mongoose = require('mongoose')

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const cors = require('cors')
app.use(cors())

require('dotenv').config()
app.use(express.json())

app.use((req, res, next) => 
{
    console.log(req.path, req.method)
    next()
})


app.use(userRoutes)
//app.use("/buy", userPatch)
app.use("/products", routes)
app.use("/users", routes)



app.use((req, res, next) => 
{
    console.log(req.path, req.method)
    next()
})

mongoose.connect(process.env.MONGODB).then(() => 
{
    app.listen(process.env.PORT, () => 
    {
        console.log("server is up");
    });
}).catch((error) => 
{
    console.log(error);
});