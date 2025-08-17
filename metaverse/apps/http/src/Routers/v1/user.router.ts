import { Router } from "express";
import { UpdateMetaDataSchema } from "../../types/index.js";
import client from "@repo/db";
import { userMiddleware } from "../../middleware/user.middleware.js";
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async(req, res) => {
    const parseData = UpdateMetaDataSchema.safeParse(req.body);
    if(!parseData.success){
         return res.status(400).json({
            message:"Validation Failed"
        })
    }
   await client.user.update({
        where:{
            id: req.userId,
        },
        data:{
            avatarId: parseData.data.avatarId,
        }
    })
    res.json({
        message: "User Profile"
    });
});


userRouter.get("/metadata/bulk", userMiddleware, async (req,res)=>{
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = userIdString.replace(/[\[\]]/g, '').split(",");
    
    const metadata = await client.user.findMany({
        where:{
            id:{
                in:userIds
            }
        },select:{
            Avatar:true,
            id:true
        }
    })
    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            imageUrl: m.Avatar?.imageUrl  // Fix: Changed from avatarId to imageUrl
        }))
    });
});