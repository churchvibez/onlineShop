const jwt = require('jsonwebtoken');
const User = require('../models/users');

const requireAuthUserPatch = async(req, res, next) =>
{
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Authorization header is required" });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id} = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id }).select('_id');
        // Check user role


        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;

        // Check user role

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = requireAuthUserPatch;
