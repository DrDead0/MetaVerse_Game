import { Router, Request, Response } from "express";
import { userRouter } from "./user.router.js";
import { spaceRouter } from "./space.router.js";
import { adminRouter } from "./admin.router.js";
import { SignupSchema, SigninSchema } from "../../types/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "@repo/db";
import { JWT_PASSWORD } from "../../config.js";

export const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    const parseData = SignupSchema.safeParse(req.body)
    if(!parseData.success){
        return res.status(400).json({
            message: "Validation Failed"
        })
    }
    const hashedPassword = await bcrypt.hash(parseData.data.password,10)
    try{
      const user =   await client.user.create({
            data:{
                username:parseData.data.username,
                password:hashedPassword,
                role: parseData.data.type === "admin" ? "Admin" : "User"
            }
        })
        return res.json({
            userId: user.id
        })
    }catch(err){
        console.error(err);
        return res.status(400).json({
            message:"User Already Exists"
        })
    }
});

router.post("/signin", async(req: Request, res: Response) => {
    const parseData = SigninSchema.safeParse(req.body);
    if(!parseData.success){
        return res.status(403).json({
            message:"Validation Failed"
        })
    }
    try{
        const user = await client.user.findUnique({
            where:{
                username:parseData.data.username
            }
        })
        if(!user){
            return res.status(404).json({
                message:"User Not Found"
            })
        }
        const isValid = await bcrypt.compare(parseData.data.password, user.password);
         if (!isValid){
            return res.status(401).json({
                message:"Invalid Credentials"
            })
        }
       const token = await jwt.sign({
            userId: user.id,
            role: user.role
       },JWT_PASSWORD);
        return res.json({
            token
        })


    }catch(err){
        console.error(err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
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