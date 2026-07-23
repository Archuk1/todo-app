import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient.js";

function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  }
  
function serializeUser(user) {
    return { id: user.id, email: user.email };
  }

export const register = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "A user with this email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });
  
      const token = signToken(user.id);
  
      return res.status(201).json({ token, user: serializeUser(user) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = signToken(user.id);
  
      return res.json({ token, user: serializeUser(user) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

export const getMe = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json({ user: serializeUser(user) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };