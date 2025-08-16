import { Express } from "express";
import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin.middleware.js";
import { AddElementSchema, CreateElementSchema, UpdateElementSchema, CreateAvatarSchema, CreateMapSchema} from "../../types";
import client from "@repo/db";

export const adminRouter = Router();


adminRouter.post("/elements",adminMiddleware,async(req,res)=>{
    const parseData = CreateElementSchema.safeParse(req.body)
    if(!parseData.success){
        return res.status(400).json({
            message:"Validation Failed"
        })
    }
    const element = await client.element.create({
        data:{
            width:parseData.data.width,
            height:parseData.data.height,
            imageUrl:parseData.data.imageUrl, 
            // static:parseData.data.static,
        }
    })
    return res.json({
        id: element.id
    })
})
adminRouter.put("/elements/:elementId",adminMiddleware,async(req,res)=>{
    const parseData = UpdateElementSchema.safeParse(req.body);
    if(!parseData.success){
        return res.status(400).json({
            message:"Validation Failed"
        })
    }
    const element = await client.element.update({
        where:{
            id: req.params.elementId,

        }, 
        data:{
            imageUrl: parseData.data.imageUrl,
        }
    })
    if(!element){
        return res.status(400.).json({
            message:"Element Not Found"
        })
    }
    res.status(200).json({
        message:"Element Updated"
    })
})
adminRouter.post("/avatar",adminMiddleware,async(req,res)=>{
    const parseData = CreateAvatarSchema.safeParse(req.body);
    if(!parseData.success){
        return res.status(400).json({
            message:"Validation Failed"
        })
    }
     const avatar = await client.avatar.create({
        data:{
            name:parseData.data.name,
            imageUrl:parseData.data.imageUrl,
        }
    })
    if(!avatar){
        return res.status(400).json({
            message:"Failed to Create"
        })
    }
    return res.json({
        id: avatar.id
    })
})
adminRouter.get("/:map",adminMiddleware,async(req,res)=>{

})



// route---> api/v1/space

adminRouter.get(":spaceId",adminMiddleware,async(req,res)=>{
    const parseData = CreateMapSchema.safeParse(req.body);
    if(!parseData.success){
        return res.status(400).json(
            {
                message:"Validation Failed"
            }
        )
    }
    const map = await client.map.create({
        data:{
            name: parseData.data.name,
            width: parseInt(parseData.data.dimension.split("x")[0]),
            height: parseInt(parseData.data.dimension.split("x")[1]),
            thumbnail: parseData.data.thumbnail,
            mapElements:{
                create: parseData.data.defaultElements.map(el => ({
                    elementId: el.elementId,
                    x: el.x,
                    y: el.y
                }))
            }
        }
    })
    
})




