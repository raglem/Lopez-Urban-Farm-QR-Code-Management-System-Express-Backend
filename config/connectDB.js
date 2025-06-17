import mongoose from 'mongoose'
async function connectDB(){
    if(!process.env.MONGODB_URI){
        throw new Error("MONGODB URI is not defined in .env file")
    }

    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to MongoDB: ${conn.connection.host}`)
    }
    catch(err){
        console.log("Error: Unable to connect to database")
    }
}
export default connectDB