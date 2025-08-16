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
import { CrateSpaceSchema } from "../../types/index.js";
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
    if (!parseData.data.mapId) {
        yield client.space.create({
            data: {
                name: parseData.data.name,
                width: parseInt(parseData.data.dimension.split("x")[0]),
                height: parseInt(parseData.data.dimension.split("x")[1]),
                //if the test case fails, then use parseData instead and check again is it working or not
                creatorId: req.userId
            }
        });
        return res.json({
            message: "Space Created "
        });
    }
    const map = yield client.map.findUnique({
        where: {
            id: parseData.data.mapId,
        },
        select: {
            mapElements: true,
        }
    });
    if (!map) {
        return res.status(404).json({
            message: "Map Not Found"
        });
    }
    const space = yield client.$transaction([
        client.space.create({
            data: {
                name: parseData.data.name,
                width: parseInt(parseData.data.dimension.split("x")[0]),
                height: parseInt(parseData.data.dimension.split("x")[1]),
                creatorId: req.userId
            }
        }),
        client.spaceElements.createMany({
            data: map.mapElements.map(element => ({
                elementId: element.elementId,
                spaceId: '', // Will be set after space creation
                x: element.x,
                y: element.y
            }))
        })
    ]);
    // res.json({
    //     spaceId: space[0].id
    // });
}));
spaceRouter.delete("/:spaceId", (req, res) => {
    res.json({ spaceId: req.params.spaceId });
});
spaceRouter.get("/all", (req, res) => {
});
spaceRouter.post("/elements", (req, res) => {
});
spaceRouter.delete("/elements", (req, res) => {
});
spaceRouter.get("/:spaceId", (req, res) => {
    return res.json({
        message: "hahahah"
    });
});
