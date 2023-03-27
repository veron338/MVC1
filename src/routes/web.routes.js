import { Router } from "express";
import * as HomeController from  "../controllers/Home.controller.js"

const RoutesWeb = Router()

RoutesWeb.get("/" , HomeController.index)


export default RoutesWeb

