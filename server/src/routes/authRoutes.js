import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { login, register, getMe } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/me", authenticate, getMe);


export default router;
