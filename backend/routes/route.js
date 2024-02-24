const express = require('express');
const Product = require('../models/products');
const { 
    getProduct, getName, getBrand, getImage, getCategory, getUsers,
    postProduct, postUser,
    patchName, patchBrand, patchImage, patchCategory, patchNumber,
    deleteName, deleteBrand, deleteImage, deleteCategory, deleteID, deleteUser,
    patchAll, patchUser
} = require('../controllers/controllers');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/products', getProduct);
router.get('/users', getUsers)
router.get('/products:name', getName);
router.get('/products/brand/:brand', getBrand);
router.get('/products/category/:category', getCategory);
router.get('/products/image/:image', getImage);

router.patch('/products/:id/:number', patchNumber);
//router.patch('/products/:id/:name', patchName);
//router.patch('/products/:id/:brand', patchBrand);
//router.patch('/products/:id/:category', patchCategory);
//router.patch('/products/:id/:image', patchImage);

// http://localhost:1337/products/:id/:name/:brand/:category/:image
router.patch('/products/:id', patchAll)
router.patch('/users/:id', patchUser)

// adding a new product
router.post('/products', postProduct);
router.post('/users', postUser)

// router.delete('/products/:XXXXXXXXX', deleteXXXXXXXX);
router.delete('/products/name/:name', deleteName);
router.delete('/products/brand/:brand', deleteBrand);
router.delete('/products/category/:category', deleteCategory);
// router.delete('/products/:image', deleteImage);
router.delete('/products/deleting/:id', deleteID);

router.delete('/users/:id', deleteUser);

module.exports = router;
