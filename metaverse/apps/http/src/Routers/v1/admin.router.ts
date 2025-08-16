import { Express } from "express";
import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin.middleware.js";
import { AddElementSchema, CreateElementSchema } from "../../types";
import client from "@repo/db";

export const adminRouter = Router();


adminRouter.post("/elements",adminMiddleware,async(req,res)=>{
    const parseData = CreateElementSchema.safeParse(req.body)
    if(!parseData.success){
        return res.status(400).json({
            message:"Validation Failed"
        })
    }
    await client.element.create({
        data:{
            width:parseData.data.width,
            height:parseData.data.height,
            imageUrl:parseData.data.imageUrl, 
            static:parseData.data.static,
        }
    })
    return res.json({
        message:"Element Created "
    })
})
adminRouter.put("/elements/:elementId",adminMiddleware,async(req,res)=>{


})
adminRouter.get("/avatar",adminMiddleware,async(req,res)=>{

})
adminRouter.get("/:map",adminMiddleware,async(req,res)=>{

})



// route---> api/v1/space

adminRouter.get(":spaceId",adminMiddleware,async(req,res)=>{

})




