import {AppError} from "../utils/AppError.js";
import User from "../models/User.js";

export const adminOnly = async (req, res, next) => {
    try {
        console.log("ADMIN MIDDLEWARE USER:", req.user);
    const user = await User.findById(req.userId);


    if(!user) {
        throw new AppError("Access denied. Admin only", 403);
    }

    next();
    } catch (err) {
       next(new AppError("Admin auth failed", 500));
    }
}