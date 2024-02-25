const express = require('express')
const {loginUser, signupUser, getUserRole, getProduct, patchNumber} = require('../controllers/userControllers')
const router = express.Router()

router.post('/login', loginUser); // No requireAuth middleware here
router.post('/signup', signupUser); // No requireAuth middleware here
router.get('/getUserRole/:username', getUserRole);
router.get('/products', getProduct);
router.patch('/buy/products/:id/:number', patchNumber);


module.exports = router