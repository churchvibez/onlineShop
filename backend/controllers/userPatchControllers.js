const Product = require('../models/products')
const User = require('../models/users')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const patchNumber = async (req, res) => {
    try {
        const { id, number } = req.params;
        if (parseInt(number) < 0) {
            return res.status(400).json({ message: "Negative numbers are not allowed" });
        }
        const result = await Product.updateOne({ _id: id }, { $set: { number: number } });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product not found or number unchanged" });
        }

        res.status(200).json({ message: "Product number updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { patchNumber }