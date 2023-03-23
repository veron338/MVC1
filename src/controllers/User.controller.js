import UserModel from "./User.model.js"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import bcrypt from "bcryptjs"
import {v4 as uuid} from "uuid"
import transporter from "../../utilities/mailer.js"
config()
//const tokenKey = "kqjqwlkjelk12jl3k1j23lk1j2l3kj12lk3j123"
const sendEmailValidateAccount = async (email, name, verifyKey)=>{
    try {
        await transporter.sendMail({
            //from: "MiWeb", 
            to: email, 
            subject: `${name} valida tu cuenta`,
            replyTo: "info@miweb.com",
            html: `
                <h2>Hola ${name}, gracias por unirte a nosotros</h2>
                <p> Por favor para validar tu cuenta haz click en el siquiente boton</p>
    
                
                <button>
                <a href="http://localhost:8080/users/verifyAccount?key=${verifyKey}&email=${email}">
                    ¡Validar mi cuenta!
                </a>
                </button>
            `
        })

    } catch (error) {
        return error
    }  

}


export const create = async (req, res) => {
    const { body } = req
    const { password, confirmpassword } = body

    // PASSWORD ------------------------------------------
    // /^[\w\-\_\.]{6,20}$/ 
    //const passwordRegExp = new RegExp( "^[\w\-\_\.]{6,20}$" )
    const passwordRegExp = new RegExp(process.env.USER_PASSWORD_REG_EXP)
    if (!passwordRegExp.test(password)) {
        return res.status(403).json({ error: true, errMsg: "La contraseña no cumple las reglas" })
    }

    if (password !== confirmpassword) {
        return res.status(403).json({ error: true, errMsg: "Las contraseñas no coinciden" })
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    body.password = hash

    // VERIFY KEY ------------------------------------------
    body.verifyKey = uuid()
    // const data = {
    //     name: body.name,
    //     username: body.username,
    //     //....
    //     password: hash
    // }

    try {
        const user = await UserModel.create(body)

        const error = sendEmailValidateAccount(user.email, user.name, user.verifyKey)
        if( error ){
            console.log(error)
        }

        res.json({
            username: user.username,
            email: user.email,
            name: user.name,
            birth: user.birth
        })
    }
    catch (error) {
        res.status(403).json(error)
    }

}


export const verifyAccount = async (req, res) => {
    const {key:verifyKey, email} = req.query
    const result = await UserModel.updateOne({email, verifyKey}, {active: true})

    if( !result.matchedCount ){ //0 -> no coincide la busqueda
        return res.status(403).json({error: true, errMsg: "El email y la clave de activacion no coinciden"})
    }

    if( !result.modifiedCount ){ //0 -> No modifico porque ya active era true
        return res.json({error: false, msg: "Esta cuenta ya habia sido verificada"})
    }

    res.json({error: false, msg:"Cuenta verificada correctamente"})
}


export const login = async (req, res) => {
    const { username, password } = req.body

    const user = await UserModel.findOne({ username }, { _id: 0, password: 1, active: 1 })// undefined


    if (!user || !await bcrypt.compare(password, user.password) ) {
        //Error Credenciales
        return res.status(403).json({ ok: false, errMsg: "Credenciales incorrectas" })
    }
    
    if (!user.active) {
        //Error Active -> la cuenta no esta activada
        return res.status(403).json({ ok: false, errMsg: "Usuario Inactivo" })
    }
    
    //Devolver el token
    const payload = { username }

    const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: process.env.TOKEN_EXPIRES_IN })
    res.json({ ok: true, token })
    // }
}

export const currentUser = async (req, res) => {
    const { username } = req.decodedToken
    const user = await UserModel.find({ username }, { _id: 0, username: 1, email: 1, name: 1 })
    //res.json(user)
    res.json({
        username: user.username,
        email: user.email,
        name: user.name
    })
}


// UserModel.create({
//     name: "Carlos Perez",
//     email: "carlitos@gmail.com",
//     password: "asdasd",
//     username: "carlitos.perez"
// })