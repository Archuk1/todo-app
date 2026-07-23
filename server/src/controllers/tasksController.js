import prisma from "../db/prismaClient.js";

export const getTasks = async (req, res) => {
    try {
      const { status } = req.query;
  
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
  };

export const getTaskById = async (req, res) => {
    try {
      const task = await prisma.task.findFirst({
        where: { id: req.params.id, userId: req.userId },
      });
  
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      return res.json(task);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

export const createTask = async (req, res) => {
    try {
      const { title, description, status } = req.body;
  
      const task = await prisma.task.create({
        data: {
          title: title,
          description: description,
          status: status,
          userId: req.userId,
        },
      });
  
      return res.status(201).json(task);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

export const updateTask = async (req, res) => {
    try {
      const { title, description, status } = req.body;
      const taskId = req.params.id;
  
      const existingTask = await prisma.task.findFirst({
        where: { id: taskId, userId: req.userId },
      });
  
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(title !== undefined ? { title: title } : {}),
          ...(description !== undefined ? { description: description } : {}),
          ...(status !== undefined ? { status } : {}),
        },
      });
  
      return res.json(task);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

export const deleteTask =  async (req, res) => {
    try {
      const taskId = req.params.id;
  
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
  };