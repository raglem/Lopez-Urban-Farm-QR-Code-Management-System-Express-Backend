import mongoose from 'mongoose'
import dotenv from 'dotenv'

const configureScript = async () => {
    dotenv.config()
    if(!process.env.MONGODB_URI){
        throw new Error("MONGODB URI is not defined in .env file")
    }

    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
    }
    catch(err){
        console.log("Error: Unable to connect to database")
    }
}
export default configureScript