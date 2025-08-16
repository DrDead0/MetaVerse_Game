var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { userRouter } from "./user.router.js";
import { spaceRouter } from "./space.router.js";
import { adminRouter } from "./admin.router.js";
import { SignupSchema, SigninSchema } from "../../types/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "@repo/db";
import { JWT_PASSWORD } from "../../config.js";
export const router = Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = SignupSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    const hashedPassword = yield bcrypt.hash(parseData.data.password, 10);
    try {
        const user = yield client.user.create({
            data: {
                username: parseData.data.username,
                password: hashedPassword,
                role: parseData.data.type === "admin" ? "Admin" : "User"
            }
        });
        return res.json({
            userId: user.id
        });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "User Already Exists"
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = SigninSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(403).json({
            message: "Validation Failed"
        });
    }
    try {
        const user = yield client.user.findUnique({
            where: {
                username: parseData.data.username
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        const isValid = yield bcrypt.compare(parseData.data.password, user.password);
        if (!isValid) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }
        const token = yield jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_PASSWORD);
        return res.json({
            token
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
router.get("/elements", (req, res) => {
    res.json({
        message: "elements"
    });
});
router.get("/avatars", (req, res) => {
    res.json({
        message: "avatars"
    });
});
router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
