const Product = require('../models/products')
const User = require('../models/users')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const getProduct = async (req, res) =>
{
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
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username role'); // Query all users and return only their usernames and roles
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getName = async (req, res) => 
{
    try {
        const { name } = req.params;
        const products = await Product.find({ name: { $regex: new RegExp(name, 'i') } });
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const getBrand = async (req, res) =>
{
    try {
        const { brand } = req.params;
        const products = await Product.find({ brand: { $regex: new RegExp(brand, 'i') } });
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const getImage = async (req, res) => 
{
    try {
        const { image } = req.params;
        const products = await Product.find({ image: { $regex: new RegExp(image, 'i') } });
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const getCategory = async (req, res) => 
{
    try {
        const { category } = req.params;
        const products = await Product.find({ category: { $regex: new RegExp(category, 'i') } });
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const postProduct = async (req, res) => 
{
    const {name, brand, category, image, number} = req.body
    let emptyFields = []
    if (!name)
    {
        emptyFields.push("name")
    }
    if (!brand)
    {
        emptyFields.push("brand")
    }
    if (!category)
    {
        emptyFields.push("category")
    }
    if (!image)
    {
        emptyFields.push("image")
    }
    if (!number)
    {
        emptyFields.push("number")
    }
    if (emptyFields.length > 0)
    {
        return res.status(400).json({error: "fill in ALL the fields", emptyFields})
    }

    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const postUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists11' });
        }

        console.log("hey" + password)
        // Create the user
        const newUser = new User({
            username,
            password, // Since the password is already hashed
            role
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const deleteName = async (req, res) =>
{
    try {
        const { name } = req.params;
        const result = await Product.deleteMany({ name: { $regex: new RegExp(name, 'i') } }, req.body);

        if (result.nModified === 0) {
            return res.status(404).json({ message: "name doesnt exist" });
        }

        res.status(200).json({ message: `deleted` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const deleteBrand = async (req, res) =>
{
    try {
        const { brand } = req.params;
        const result = await Product.deleteMany({ brand: { $regex: new RegExp(brand, 'i') } });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "brand doesnt exist" });
        }

        res.status(200).json({ message: `deleted` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const deleteImage = async (req, res) =>
{
    try {
        const { image } = req.params;
        const result = await Product.deleteMany({ image });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "image doesnt exist" });
        }

        res.status(200).json({ message: `deleted` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const deleteCategory = async (req, res) =>
{
    try {
        const { category } = req.params;
        const result = await Product.deleteMany({ category: { $regex: new RegExp(category, 'i') } });
        console.error(result)
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "category doesnt exist" });
        }
        res.status(200).json({ message: `deleted` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const deleteID = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: `Product deleted successfully` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const patchNumber = async (req, res) => {
    try {
        const { id, number } = req.params; // Extract product ID and new number from params

        // Update the product with the given _id
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

const patchName = async (req, res) => {
    try {
        const { id, name } = req.params; // Extract product ID and new name from params

        // Update the product with the given _id
        const result = await Product.updateOne({ _id: id }, { $set: { name: name } });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product not found or name unchanged" });
        }

        res.status(200).json({ message: "Product name updated successfully1" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const patchBrand = async (req, res) => {
    try {
        const { id, brand } = req.params; // Extract product ID and new brand from params

        // Update the product with the given _id
        const result = await Product.updateOne({ _id: id }, { $set: { brand: brand } });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product not found or brand unchanged" });
        }

        res.status(200).json({ message: "Product brand updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const patchCategory = async (req, res) => {
    try {
        const { id, category } = req.params; // Extract product ID and new category from params

        // Update the product with the given _id
        const result = await Product.updateOne({ _id: id }, { $set: { category: category } });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product not found or category unchanged" });
        }

        res.status(200).json({ message: "Product category updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const patchImage = async (req, res) => {
    try {
        const { id, image } = req.params; // Extract product ID and new image from params

        // Update the product with the given _id
        const result = await Product.updateOne({ _id: id }, { $set: { image: image } });

        if (result.nModified === 0) {
            return res.status(404).json({ message: "Product not found or image unchanged" });
        }

        res.status(200).json({ message: "Product image updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const patchAll = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, category, image, number } = req.body;

        // Construct the update object
        const updates = {};
        if (name) updates.name = name;
        if (brand) updates.brand = brand;
        if (category) updates.category = category;
        if (image) updates.image = image;
        if (number) updates.number = number

        // Find the product by ID and update its fields
        const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updates }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const patchUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;

        // Construct the update object
        const updates = {};
        if (username) updates.username = username;
        if (role) updates.role = role;

        // Find the user by ID and update its fields
        const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: `User deleted successfully` });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = 
{
    getProduct, getName, getBrand, getImage, getCategory, getUsers,
    postProduct, postUser,
    patchName, patchBrand, patchImage, patchCategory, patchNumber, patchUser,
    deleteName, deleteBrand, deleteImage, deleteCategory, deleteID, deleteUser,
    patchAll
}