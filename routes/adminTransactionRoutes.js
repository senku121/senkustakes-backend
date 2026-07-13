const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getAllTransactions
} = require("../controllers/adminTransactionController");

router.get(
    "/transactions",
    verifyToken,
    getAllTransactions
);

module.exports = router;