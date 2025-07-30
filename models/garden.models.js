import mongoose from 'mongoose'

const gardenSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    visibility: {
        type: Boolean,
        required: true,
    },
    image: {
        type: {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        },
        required: false,
    }
})

const Garden = mongoose.model('Garden', gardenSchema)
export default Garden