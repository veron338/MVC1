import jwt from "jsonwebtoken"
import {config} from "dotenv"
config()

const tokenKey = process.env.TOKEN_KEY

const authentication = (req, res, next)=>{
    let token = req.headers["x-access-token"] || req.headers["authorization"]

    if(!token){
        res.status(403).json( {status: false, errMsg:"Token is Required"} )
        return
    }
    
    //Que el token sea valido
    token = token.replace("Bearer ", "")

    jwt.verify(token, tokenKey, (err, payload)=>{
        if(err) res.status(403).json({status: false, errMsg: "Invalid or Expired Token"})

        else {
            req.decodedToken = payload //Payload del token recibido

            const newPayload = {...payload}
            delete newPayload.exp 
            delete newPayload.iat
            req.newToken = jwt.sign(newPayload, tokenKey, {expiresIn: process.env.TOKEN_EXPIRES_IN})
            next()
        }
    })  
}

export default authentication