const Product = require('../models/products');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const cors = require('cors');
app.use(cors());

require('dotenv').config();
app.use(express.json());

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
});

const maxAge = 3 * 24 * 60 * 60;

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: maxAge });
};

const getUserRole = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ role: user.role });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(200).json({ username, token }); // Send back the token along with response
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.signup(username, password);
        const token = createToken(user._id);
        res.status(200).json({ username, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const { name } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const products = await Product.find({ name: { $regex: new RegExp(name, 'i') } })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const patchNumber = async (req, res) => {
    try {
        const { id, number } = req.params; // Extract product ID and new number from params

        // Validate if the number is negative
        if (parseInt(number) < 0) {
            return res.status(400).json({ message: "Negative numbers are not allowed" });
        }

        // Update the product with the given _id
        const result = await Product.updateOne({ _id: id }, { $set: { number: number } });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product not found or number unchanged" });
        }

        console.log('Emitting productBought event');

        res.status(200).json({ message: "Product number updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { loginUser, signupUser, getUserRole, getProduct, patchNumber };
