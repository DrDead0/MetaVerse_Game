import { Router, Request, Response } from "express";

export const router = Router();

router.get("/signup", (req: Request, res: Response) => {
    res.json({
        message: "signup"
    });
});

router.get("/signin", (req: Request, res: Response) => {
    res.json({
        message: "signin"
    });
});