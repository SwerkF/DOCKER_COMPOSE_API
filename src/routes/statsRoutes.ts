import express from "express";
import { getStats } from "@/controllers/statsController";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";

const router = express.Router();

router.get("/", isAuthenticated, verifyAccess(["admin"]), getStats);

export default router;
