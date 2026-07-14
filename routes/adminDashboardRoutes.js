const express = require("express");

const router = express.Router();


const {
    getDashboard
} = require("../controllers/adminDashboardController");


const {
    verifyToken
} = require("../middleware/authMiddleware");



/*================================
        ADMIN DASHBOARD ROUTE
================================*/


router.get(
    "/",
    verifyToken,
    getDashboard
);



module.exports = router;