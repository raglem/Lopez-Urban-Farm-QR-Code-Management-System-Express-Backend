import mongoose from 'mongoose'

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if(!process.env.MONGODB_URI){
        throw new Error('MONGODB URI is not defined in .env file')
    }

    try{
        if (cached.conn) return cached.conn;

        if (!cached.promise) {
            cached.promise = await mongoose.connect(process.env.MONGODB_URI, {})
            cached.conn = cached.promise;
        }
        
        console.log(`Connected to MongoDB: ${cached.conn.connection.host}`)
    }
    catch(err){
        console.error('Error connecting to MongoDB:', err)
        throw new Error('Error connecting to MongoDB')
    }
}

export default connectDB