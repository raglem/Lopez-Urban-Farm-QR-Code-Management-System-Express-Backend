import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_]+$/,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Owner', 'Staff']
    }
})

const User = mongoose.model('User', userSchema)
export default User