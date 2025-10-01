//most important step of backend is to connect with database
//first import mongoose
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//this is a repeting process so we are gonna use async and await
//we creat e async function and wait till mongoose.connect connect to the databse
//mongoose.connect(urlofDatabse/name of datbase) name of the database could be anything but it needs to constant all over backend
//so we have defined it into the constanst .js file
//for the resolving app crashing we have used try catch
const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`MONGO DB CONNNECTED ${connectionInstance.connection.host}`);
       
        
        
    } catch (error) {
        console.log("ERROR OCCURED",error);
        process.exit(1)
        
    }
}
export default connectDB;