const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const {

register,
login,
me,
verifyEmail,
resendOTP,
forgotPassword,
verifyResetOTP,
resetPassword

} = require("../controllers/authController");




router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

router.post("/login", login);
router.get("/me", verifyToken, me);
router.post(
"/forgot-password",
forgotPassword
);
router.post(
"/verify-reset-otp",
verifyResetOTP
);
router.post(
"/reset-password",
resetPassword
);

module.exports = router;