const express = require('express');
const routes = require('./routes/route');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const http = require('http');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use("/", routes);

// app.use((req, res, next) => 
// {
//     console.log(req.path, req.method);
//     next();
// });

mongoose.connect(process.env.MONGODB).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.log("MongoDB connection error:", error);
});

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);
    socket.emit('socketId', socket.id);
    socket.on("send_message", (data) =>
    {
        socket.broadcast.emit("receive_message", data)
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
