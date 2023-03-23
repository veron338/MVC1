import express from "express"
import mongoose from "mongoose"
import multer from "multer";
import cors from "cors"
import RouterAPI from "./routers/Router.js"
import * as dotenv from 'dotenv'

dotenv.config({path: "./.env"})

mongoose.set('strictQuery', false)
await mongoose.connect(`mongodb://${process.env.DB_URL}/${process.env.DB_DATABASE}`);

const app = express()

//Middlewares
app.use( cors({
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}) )

app.use( express.static("./REST/public") )

app.use((req, res, next) => {
    console.log("Method: " + req.method)
    console.log("URL: " + req.url)
    console.log("------------------------------------")

    next()
})

// req.body
app.use( express.json() )
app.use( express.urlencoded({extended:true}) )
app.use( multer().none() )


//Router
app.get("/", (req, res) => {
    res.send("HOME")
})

app.use(RouterAPI)


app.listen(8080)