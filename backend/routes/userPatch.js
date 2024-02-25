const express = require('express');
const { patchNumber } = require('../controllers/userPatchControllers');
const requireAuthUserPatch = require('../middleware/requireAuthUserPatch');

const router = express.Router();

router.use(requireAuthUserPatch); // Apply requireAuthUserPatch middleware to the router

router.patch('/buy/products/:id/:number', patchNumber);

module.exports = router;
