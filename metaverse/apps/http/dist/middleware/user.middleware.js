import { JWT_PASSWORD } from "../config.js";
import jwt from "jsonwebtoken";
export const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
    if (!token) {
        return res.status(403).json({
            message: "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_PASSWORD);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Authorization Failed"
        });
    }
};
