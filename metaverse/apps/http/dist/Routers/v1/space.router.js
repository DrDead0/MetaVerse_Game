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
import { AddElementSchema, CrateSpaceSchema, DeleteElementSchema } from "../../types/index.js";
;
export const spaceRouter = Router();
import client from "@repo/db";
import { userMiddleware } from "../../middleware/user.middleware.js";
spaceRouter.post("/", userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = CrateSpaceSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    if (!parseData.data.mapId || parseData.data.mapId === "") {
        if (!parseData.data.dimension) {
            return res.status(400).json({
                message: "Dimension is required when mapId is not provided"
            });
        }
        const space = yield client.space.create({
            data: {
                name: parseData.data.name,
                width: parseInt(parseData.data.dimension.split("x")[0]),
                height: parseInt(parseData.data.dimension.split("x")[1]),
                //if the test case fails, then use parseData instead and check again is it working or not
                creatorId: req.userId
            }
        });
        return res.json({
            spaceId: space.id
        });
    }
    const map = yield client.map.findUnique({
        where: {
            id: parseData.data.mapId,
        },
        select: {
            mapElements: true,
            width: true,
            height: true,
        }
    });
    if (!map) {
        return res.status(404).json({
            message: "Map Not Found"
        });
    }
    const space = yield client.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
        const space = yield client.space.create({
            data: {
                name: parseData.data.name,
                // width: parseInt(parseData.data.dimension.split("x")[0]),
                // height: parseInt(parseData.data.dimension.split("x")[1]),
                width: map.width,
                height: map.height,
                creatorId: req.userId
            }
        });
        yield client.spaceElements.createMany({
            data: map.mapElements.map(e => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x,
                y: e.y
            }))
        });
        return space;
    }));
    return res.json({
        spaceId: space.id
    });
    // res.json({
    //     spaceId: space[0].id
    // });
}));
spaceRouter.delete("/:spaceId", userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const space = yield client.space.findUnique({
        where: {
            id: req.params.spaceId,
        },
        select: {
            creatorId: true
        }
    });
    if (!space) {
        return res.status(404).json({
            message: "Space Not Found"
        });
    }
    if (space.creatorId !== req.userId) {
        return res.status(400).json({
            message: "You are not allowed to delete this space"
        });
    }
    yield client.space.delete({
        where: {
            id: req.params.spaceId,
        }
    });
    return res.json({
        message: "Space Deleted Successfully"
    });
}));
spaceRouter.get("/all", userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const spaces = yield client.space.findMany({
        where: {
            creatorId: req.userId
        }
    });
    return res.json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimension: `${s.width}x${s.height}`,
        }))
    });
}));
spaceRouter.post("/elements", userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = AddElementSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    const space = yield client.space.findUnique({
        where: {
            id: parseData.data.spaceId,
            creatorId: req.userId
        },
        select: {
            width: true,
            height: true,
        }
    });
    if (!space) {
        return res.status(400).json({ message: "space not found" });
    }
    // Check if element position is within space boundaries
    if (parseData.data.x >= space.width || parseData.data.y >= (space.height || 0)) {
        return res.status(400).json({
            message: "Element position is outside space boundaries"
        });
    }
    yield client.spaceElements.create({
        data: {
            spaceId: parseData.data.spaceId,
            elementId: parseData.data.elementId,
            x: parseData.data.x,
            y: parseData.data.y,
        }
    });
    return res.json({
        message: "Element Added Successfully"
    });
}));
spaceRouter.delete("/elements", userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = DeleteElementSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Validation Failed"
        });
    }
    const spaceElement = yield client.spaceElements.findFirst({
        where: {
            id: parseData.data.id
        },
        include: {
            space: true
        }
    });
    if (!(spaceElement === null || spaceElement === void 0 ? void 0 : spaceElement.space.creatorId) || spaceElement.space.creatorId !== req.userId) {
        return res.status(403).json({
            message: "You are not allowed to delete this element"
        });
    }
    yield client.spaceElements.delete({
        where: {
            id: parseData.data.id,
        }
    });
    return res.json({
        message: "Element deleted "
    });
}));
spaceRouter.get("/:spaceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const space = yield client.space.findUnique({
        where: {
            id: req.params.spaceId
        },
        include: {
            space: {
                include: {
                    element: {
                        select: {
                            id: true,
                            width: true,
                            height: true,
                            imageUrl: true
                        }
                    }
                }
            }
        }
    });
    if (!space) {
        return res.status(400).json({
            message: "Space Not Found"
        });
    }
    return res.json({
        dimensions: `${space.width}x${space.height}`,
        elements: space.space.map((e) => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
            },
            x: e.x,
            y: e.y
        })),
    });
}));
