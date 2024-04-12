import { Router } from "express";
import * as controller from "./message.controller.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import auth from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", asyncHandler(auth), asyncHandler(controller.getMessages));
router.post("/", asyncHandler(auth), asyncHandler(controller.sendMessage));

export default router;
