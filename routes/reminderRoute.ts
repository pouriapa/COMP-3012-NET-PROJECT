import express from "express";
const  router = express.Router();
import reminderController from "../controllers/reminderController";
import {ensureAuthenticated} from "../middleware/checkAuth";


router.get("/", ensureAuthenticated, reminderController.getReminders);
router.get("/add", ensureAuthenticated ,(req, res) => res.render("reminder/create"));
router.post("/add",ensureAuthenticated, reminderController.addReminder);
router.get("/:id" , ensureAuthenticated, reminderController.getReminderById);
router.get("/:id/edit",ensureAuthenticated , reminderController.editReminderById);
router.post("/update/:id", ensureAuthenticated, reminderController.updateReminderById);
router.post("/delete/:id",ensureAuthenticated, reminderController.deleteReminder);

export default router;

