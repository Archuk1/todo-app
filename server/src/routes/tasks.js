import { Router } from "express";
import prisma from "../prismaClient.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

export const VALID_STATUSES = ["todo", "in progress", "done"];

// Every route below requires a valid JWT.
router.use(authenticate);

// GET /api/tasks?status=todo
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status filter. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId,
        ...(status ? { status } : {}),
      },
      orderBy: { id: "desc" },
    });

    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(req.params.id), userId: req.userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? String(description).trim() : "",
        status: status || "todo",
        userId: req.userId,
      },
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const taskId = Number(req.params.id);

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: String(description).trim() } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({ where: { id: taskId } });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
