import express from "express";
const router = express.Router();
import {ensureAuthenticated} from "../middleware/checkAuth";
import userController from "../controllers/userController";


router.get("/register", userController.register);
router.post("/register", userController.registerUser);
router.get("/dashboard", ensureAuthenticated, userController.dashboard);

export default router;
