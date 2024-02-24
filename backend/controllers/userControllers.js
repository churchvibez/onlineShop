const Product = require('../models/products')
const User = require('../models/users')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: maxAge})
}

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
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(200).json({ username, token }); // Send back the token along with response
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const signupUser = async (req, res) => 
{
    const {username, password} = req.body
    try
    {
        const user = await User.signup(username, password)
        const token = createToken(user._id)
        res.status(200).json({username, token})
    }
    catch (error)
    {
        res.status(400).json({error: error.message})
    }
}



module.exports = {loginUser, signupUser, getUserRole}