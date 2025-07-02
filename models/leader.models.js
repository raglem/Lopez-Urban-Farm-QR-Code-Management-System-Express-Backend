import mongoose from 'mongoose'

const leaderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
})

const Leader = mongoose.model('Leader', leaderSchema)
export default Leader