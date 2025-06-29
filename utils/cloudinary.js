import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dytm6xspb",
    api_key: process.env.CLOUDINARY_API_KEY || "195854114948474",
    api_secret: process.env.CLOUDINARY_API_SECRET || "OZPBVJI7U8s7pu3xdfBE1oOHDc8"
})

export default cloudinary