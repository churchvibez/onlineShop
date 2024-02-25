const express = require('express');
const Product = require('../models/products');
const { 
    getProduct, getName, getBrand, getImage, getCategory, getUsers, getAllBrands, getAllCategories,
    postProduct, postUser,
    patchName, patchBrand, patchImage, patchCategory, patchNumber,
    deleteName, deleteBrand, deleteImage, deleteCategory, deleteID, deleteUser,
    patchAll, patchUser, patchManyNames, patchManyBrands, patchManyCategories
} = require('../controllers/controllers');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/users', getUsers)
router.get('/products/brands', getAllBrands)
router.get('/products/categories', getAllCategories)
router.get('/products:name', getName);
router.get('/products/brand/:brand', getBrand);
router.get('/products/category/:category', getCategory);
router.get('/products/image/:image', getImage);

router.patch('/products/:id/:number', patchNumber);
router.patch('/products/name/:name/:newName', patchManyNames)
router.patch('/products/brand/:brand/:newBrand', patchManyBrands)
router.patch('/products/category/:category/:newCategory', patchManyCategories)
// http://localhost:1337/products/:id/:name/:brand/:category/:image
router.patch('/products/:id', patchAll)
router.patch('/users/:id', patchUser)

// adding a new product
router.post('/products', postProduct);
router.post('/users', postUser)

// router.delete('/products/:XXXXXXXXX', deleteX    XXX XXXX);
router.delete('/products/name/:name', deleteName);
router.delete('/products/brand/:brand', deleteBrand);
router.delete('/products/category/:category', deleteCategory);
// router.delete('/products/:image', deleteImage);
router.delete('/products/deleting/:id', deleteID);

router.delete('/users/:id', deleteUser);

module.exports = router;
