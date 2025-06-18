import User from "../models/user.models.js";
import jwt from "jsonwebtoken"

const verifyOwner = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if(!user || user.role !== 'Owner')   return res.status(403).json({ success: false, message: `${user.username} does not exist or is not an owner`})
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token' });
    }
}

export default verifyOwner