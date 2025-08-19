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
import { UpdateMetaDataSchema } from "../../types/index.js";
import client from "@repo/db";
import { userMiddleware } from "../../middleware/user.middleware.js";
export const userRouter = Router();
userRouter.post("/metadata", userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = UpdateMetaDataSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    // Check if avatar exists
    const avatar = yield client.avatar.findUnique({
        where: {
            id: parseData.data.avatarId
        }
    });
    if (!avatar) {
        return res.status(400).json({
            message: "Avatar not found"
        });
    }
    yield client.user.update({
        where: {
            id: req.userId,
        },
        data: {
            avatarId: parseData.data.avatarId,
        }
    });
    res.json({
        message: "User Profile"
    });
}));
userRouter.get("/metadata/bulk", userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userIdString = ((_a = req.query.ids) !== null && _a !== void 0 ? _a : "[]");
    const userIds = userIdString.replace(/[\[\]]/g, '').split(",");
    const metadata = yield client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }, select: {
            Avatar: true,
            id: true
        }
    });
    res.json({
        avatars: metadata.map(m => {
            var _a;
            return ({
                userId: m.id,
                imageUrl: (_a = m.Avatar) === null || _a === void 0 ? void 0 : _a.imageUrl // Fix: Changed from avatarId to imageUrl
            });
        })
    });
}));
