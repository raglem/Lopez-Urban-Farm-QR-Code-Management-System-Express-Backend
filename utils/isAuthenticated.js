import jwt from 'jsonwebtoken'
import User from '../models/user.models.js'

const isAuthenticated = async (req) => {
    // Check if token is included
    let token = req.header('Authorization')
    if(!token) {
        return false
    }

    // Remove 'Bearer ' prefix if it exists
    if(token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!await User.findById(decoded.userId)){
            return false
        }
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export default isAuthenticated