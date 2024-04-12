import { Router } from "express";
import * as controller from "./user.controller.js";
import auth from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import validate from "../../middleware/validation.middleware.js";
import { newPasswordSchema } from "../../validation/user.validation.js";

const router = Router();

router.get("/profile", asyncHandler(auth), asyncHandler(controller.profile));
router.patch(
  "/update-pwd",
  asyncHandler(auth),
  validate(newPasswordSchema),
  asyncHandler(controller.updatePassword),
);

export default router;
