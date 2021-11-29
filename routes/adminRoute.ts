import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController";
import {isAdmin, ensureAuthenticated} from "../middleware/checkAuth";


router.get('/users', ensureAuthenticated, isAdmin, adminController.viewUsers);
router.get('/user/activate/:id',ensureAuthenticated, isAdmin, adminController.activateUser);
router.get('/user/deactivate/:id',ensureAuthenticated, isAdmin, adminController.deactivateUser);
router.get('/user/edit/:id', ensureAuthenticated, isAdmin, adminController.editUser );
router.post('/user/edit/:id', ensureAuthenticated, isAdmin, adminController.updateUserById);


export default router;