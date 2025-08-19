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
import { CreateElementSchema, UpdateElementSchema, CreateAvatarSchema, CreateMapSchema } from "../../types/index.js";
import client from "@repo/db";
export const adminRouter = Router();
adminRouter.post("/elements", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = CreateElementSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    const element = yield client.element.create({
        data: {
            width: parseData.data.width,
            height: parseData.data.height,
            imageUrl: parseData.data.imageUrl,
            static: parseData.data.static,
        }
    });
    return res.json({
        id: element.id
    });
}));
adminRouter.put("/elements/:elementId", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = UpdateElementSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    try {
        const element = yield client.element.update({
            where: {
                id: req.params.elementId,
            },
            data: {
                imageUrl: parseData.data.imageUrl,
            }
        });
        res.status(200).json({
            message: "Element Updated"
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Element Not Found"
        });
    }
}));
adminRouter.post("/avatar", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = CreateAvatarSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    const avatar = yield client.avatar.create({
        data: {
            name: parseData.data.name,
            imageUrl: parseData.data.imageUrl,
        }
    });
    if (!avatar) {
        return res.status(400).json({
            message: "Failed to Create"
        });
    }
    return res.json({
        id: avatar.id
    });
}));
adminRouter.get("/maps", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const maps = yield client.map.findMany();
    return res.json({
        maps: maps.map(m => ({
            id: m.id,
            name: m.name,
            thumbnail: m.thumbnail,
            dimension: `${m.width}x${m.height}`
        }))
    });
}));
// route---> api/v1/space
adminRouter.post("/map", adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = CreateMapSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    const map = yield client.map.create({
        data: {
            name: parseData.data.name,
            width: parseInt(parseData.data.dimension.split("x")[0]),
            height: parseInt(parseData.data.dimension.split("x")[1]),
            thumbnail: parseData.data.thumbnail,
            mapElements: {
                create: parseData.data.defaultElements.map(el => ({
                    elementId: el.elementId,
                    x: el.x,
                    y: el.y
                }))
            }
        }
    });
    return res.json({
        id: map.id
    });
}));
