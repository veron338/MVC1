import mongoose from "mongoose"
import { config } from "dotenv";

config()

mongoose.set('strictQuery', false)
await mongoose.connect(`mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);