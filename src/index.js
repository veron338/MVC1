import express from "express"
import multer from "multer"
import RoutesWeb from "./routes/web.routes.js"
import  "./providers/Mongo.provider.js"
import hbs from "./config/handlebars.js"
import { config } from "dotenv"
config()


const app = express()

//handlebars

app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views",process.env.VIEWS_FOLDER)

//Middlewares


app.use( express.static("/public") )

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

app.use(RoutesWeb)


app.listen(process.env.APP_PORT)