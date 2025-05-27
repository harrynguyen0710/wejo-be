const express = require("express");
const playpalsController = require("../../controllers/playpals.controller");

const router = express.Router();


router.get('/:userId', playpalsController.getPlaypals);
router.post('/create', playpalsController.createUserPlaypal);


module.exports = router;
