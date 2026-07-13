const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {

    getTransactions

} = require("../controllers/transactionsController");

router.get(

    "/",

    verifyToken,

    getTransactions

);

module.exports = router;