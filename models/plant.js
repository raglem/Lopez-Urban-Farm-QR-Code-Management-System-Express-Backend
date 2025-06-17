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
    // nested field for metadata of image stored in Cloudinary
    image: {
        url: { type: String },
        public_id: { type: String }
    },
})

const Plant = mongoose.model('Plant', plantSchema)
export default Plant