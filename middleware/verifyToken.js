import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')
    if(!token)  return res.status(401).json({ success: false, message: 'User is not logged in to an active session' })

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if(!await User.findById(decoded.userId)){
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Invalid authentication token' });
    }
    
}
export default verifyToken