import { Router, Request, Response } from "express";
import { userRouter } from "./user.router.js";
import { spaceRouter } from "./space.router.js";
import { adminRouter } from "./admin.router.js";
import { SigninSchema } from "../../types/index.js";
import client from "@repo/db";
import * as Prisma from "@prisma/client";

export const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    const parseData = SigninSchema.safeParse(req.body)
    if(!parseData.success){
        return res.status(400).json({
            message: "Validation Failed"
        })
    }
    try{
        await client.user.create({
            data:{
                username:parseData.data.username,
                password:parseData.data.password,
                role: parseData.data.type === "admin" ? "ADMIN" : "USER"
            }
        })
    }catch(err){}
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
    res.json({
        message:"elements"
    })
})

router.get("/avatars",(req,res)=>{
    res.json({
        message:"avatars"
    })
})

router.use("/user",userRouter)
router.use("/space",spaceRouter)
router.use("/admin",adminRouter)