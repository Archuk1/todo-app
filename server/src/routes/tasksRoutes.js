import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/tasksController.js";
import { validate } from "../middleware/validate.js";
import { getTasksQuerySchema, taskIdParamSchema, createTaskSchema, updateTaskSchema } from "../validations/taskValidation.js";

const router = Router();

router.use(authenticate);


router.get("/", validate(getTasksQuerySchema, "query"), getTasks);

router.get("/:id", validate(taskIdParamSchema, "params"), getTaskById);

router.post("/", validate(createTaskSchema), createTask);

router.put("/:id", validate(taskIdParamSchema, "params"), validate(updateTaskSchema), updateTask);

router.delete("/:id", validate(taskIdParamSchema, "params"), deleteTask);

export default router;
