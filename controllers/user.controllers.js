import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user.models.js'

export const LoginController = async (req, res) => {
    const { username, password } = req.body
    if(!username || !password)  return res.status(400).json({ success: false, message: `Username and password fields must both be provided`})
    
    try{
        const user = await User.findOne({ username })
        if(!user)   return res.status(404).json({ success: false, message: `User with ${username} not found`})

        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch)    return res.status(401).json({ success: false, message: `User with ${username} not found with matching password`})

        const token = jwt.sign( {userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1h'} )
        return res.status(201).json({ success: 'true', message: 'User authentication successful', token: token })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}