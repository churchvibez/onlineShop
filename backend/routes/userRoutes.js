const express = require('express')
const {loginUser, signupUser, getUserRole} = require('../controllers/userControllers')
const router = express.Router()

router.post('/login', loginUser); // No requireAuth middleware here
router.post('/signup', signupUser); // No requireAuth middleware here
router.get('/getUserRole/:username', getUserRole);



module.exports = router