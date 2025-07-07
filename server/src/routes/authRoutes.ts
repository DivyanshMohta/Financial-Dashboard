import express from "express";
import { register, login, getProfile } from "../controllers/authController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register as express.RequestHandler);
router.post("/login", login as express.RequestHandler);
router.get("/profile", authenticateJWT, getProfile);

export default router;