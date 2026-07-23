import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/tasksController.js";

const router = Router();

router.use(authenticate);


router.get("/", getTasks);

router.get("/:id", getTaskById);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
