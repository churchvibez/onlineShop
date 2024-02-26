const express = require('express');
const { patchNumber } = require('../controllers/userPatchControllers');
const requireAuthUserPatch = require('../middleware/requireAuthUserPatch');

const router = express.Router();

router.use(requireAuthUserPatch);
router.patch('/buy/products/:id/:number', patchNumber);

module.exports = router;
