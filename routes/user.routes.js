
import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controller/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected route example
router.post("/logout", verifyJwt, logoutUser);

router.get("/dashboard", verifyJwt, (req, res) => {
    res.json({
        message: "Welcome to the protected dashboard!",
        user: req.user
    });
});
export default router;
