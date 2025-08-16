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
import { adminMiddleware } from "../../middleware/admin.middleware.js";
import { CreateElementSchema } from "../../types";
import client from "@repo/db";
export const adminRouter = Router();
adminRouter.post("/elements", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = CreateElementSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    yield client.element.create({
        data: {
            width: parseData.data.width,
            height: parseData.data.height,
            imageUrl: parseData.data.imageUrl,
            static: parseData.data.static,
        }
    });
    return res.json({
        message: "Element Created "
    });
}));
adminRouter.put("/elements/:elementId", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
adminRouter.get("/avatar", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
adminRouter.get("/:map", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// route---> api/v1/space
adminRouter.get(":spaceId", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
