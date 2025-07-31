import { Router, Request, Response } from "express";
import { userRouter } from "./user.router.js";
import { spaceRouter } from "./space.router.js";
import { adminRouter } from "./admin.router.js";
export const router = Router();

router.post("/signup", (req: Request, res: Response) => {
    res.json({
        message: "signup"
    });
});

router.post("/signin", (req: Request, res: Response) => {
    res.json({
        message: "signin"
    });
});

router.get("/elements",(req,res)=>{
    
})

router.get("/avatars",(req,res)=>{

})

router.use("/user",userRouter)
router.use("/space",spaceRouter)
router.use("/admin",adminRouter)