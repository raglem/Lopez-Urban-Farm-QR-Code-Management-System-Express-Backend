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

export const GetAllUsersController = async (req, res) => {
    const users = await User.find()
    return res.status(200).json({ success: true, users })
}

export const AddUserController = async (req, res) => {
    try{
        // Verify request body has all required fields
        const { username, password } = req.body
        if(!username || !password)   return res.status(400).json({ success: false, message: 'Username and password fields must both be provided'})
        
        // Verify username is not already taken
        const existingUser = await User.findOne({ username })
        if(existingUser)   return res.status(400).json({ success: false, message: `Username ${username} is already taken` })
        
        // Create new user with hashed password and default role of 'Staff'
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = User({
            username,
            password: hashedPassword,
            role: 'Staff'
        })
        await newUser.save()
        return res.status(200).json({ 
            success: false, 
            message: `Account with ${username} successfully created`, 
            data: {
                username: newUser.username,
                role: newUser.role,
                id: newUser._id
            } 
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export const RemoveUserController = async (req, res) => {
    try{
        // Verify all required fields
        const userToRemoveId = req.body.user
        if(!userToRemoveId)   return res.status(400).json({ success: false, message: 'Specified user must be provided'})
        
        // Retrieve user to remove
        const userToRemove = await User.findById(userToRemoveId)
        if(!userToRemove) return res.status(404).json({ success: false, message: 'User to remove not found'})
        
        // Check userToRemove is not the only owner
        if(userToRemove.role === 'Owner' && await User.find({ role: 'Owner', _id: { $ne: userToRemoveId } }).countDocuments() === 0) {
            return res.status(400).json({ success: false, message: `${userToRemove.username} is the only owner. There must be at least one Owner` })
        }

        // Delete user
        const deletedUser = await User.deleteOne({ _id: userToRemoveId })
        console.log(deletedUser)
        return res.status(200).json({ success: true, message: `User with ${userToRemove.username} successfully removed`})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error'})
    }
}

export const EditRoleController = async (req, res) => {
    try{
        // Verify request body has all required fields
        const userToEditId = req.body.user
        const { role } = req.body
        if(!userToEditId || !role)   return res.status(400).json({ success: false, message: 'Specified user and assigned role must be provided'})
        if(role !== 'Owner' && role !== 'Staff')  return res.status(400).json({ success: false, message: 'Role must be either Owner or Staff'})
        
        // Retrieve user to edit
        const userToEdit = await User.findById(userToEditId)
        if(!userToEdit) return res.status(404).json({ success: false, internalMessage: 'User to edit not found'})

        // Ensure there is at least one Owner in the system
        if(role === 'Owner') {
            const ownerCount = await User.find({ role: 'Owner', _id: { $ne: userToEditId } }).countDocuments();
            if(ownerCount === 0) {
                return res.status(400).json({ success: false, message: 'There must be at least one Owner'});
            }
        }
        // Update user role
        userToEdit.role = role
        await userToEdit.save()
        return res.status(200).json({ success: true, message: `${userToEdit.username} role updated to ${role}`})
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
