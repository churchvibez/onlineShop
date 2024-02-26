const express = require('express')
const {loginUser, signupUser, getUserRole, getProduct, patchNumber} = require('../controllers/userControllers')
const router = express.Router()

router.post('/login', loginUser); // No requireAuth middleware here
router.post('/signup', signupUser); 
router.get('/getUserRole/:username', getUserRole);
router.get('/products', getProduct);
router.patch('/buy/products/:id/:number', patchNumber);


module.exports = router