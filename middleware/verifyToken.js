import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
const verifyToken = async (req, res, next) => {
    // Verify the token
    try {
        // Check if token is included
        let token = req.header('Authorization')
        if(!token) {
            return res.status(401).json({ success: false, message: 'User is not logged in to an active session' })
        }

        // Remove 'Bearer ' prefix if it exists
        if(token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!await User.findById(decoded.userId)){
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Invalid authentication token' });
    }
    
}
export default verifyToken