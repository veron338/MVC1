import nodemailer from "nodemailer"
import * as dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER , //no-reply@empresa.com
        pass: process.env.SMTP_PASSWORD
    }
})

export default transporter