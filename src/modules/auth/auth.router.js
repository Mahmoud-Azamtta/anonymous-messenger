import { Router } from "express";
import * as controller from "./auth.controller.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import validate from "../../middleware/validation.middleware.js";
import {
  loginSchema,
  registerSchema,
} from "../../validation/auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(controller.register),
);
router.post("/login", validate(loginSchema), asyncHandler(controller.login));
router.get("/confirm-email/:token", asyncHandler(controller.confirmEmail));

export default router;
