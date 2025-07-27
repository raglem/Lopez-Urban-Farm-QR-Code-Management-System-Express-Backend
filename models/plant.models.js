import mongoose from 'mongoose'

const { Schema } = mongoose

const plantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
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
    // nested field for metadata of image stored in Cloudinary
    image: {
        type: {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        },
        required: false
    },
})

const Plant = mongoose.model('Plant', plantSchema)
export default Plant