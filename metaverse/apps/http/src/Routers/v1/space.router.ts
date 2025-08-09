import { Router } from "express";
export const spaceRouter = Router();


spaceRouter.post("/", (req, res) => {  
    res.json({
        message:"space Created"
    })
});


spaceRouter.delete("/:spaceId", (req, res) => {  
    res.json({spaceId: req.params.spaceId})
});


spaceRouter.get("/all", (req, res) => {  
});

spaceRouter.post("/elements", (req, res) => {  
});

spaceRouter.delete("/elements", (req, res) => {  
});

spaceRouter.get("/:spaceId", (req, res) => {  
});
