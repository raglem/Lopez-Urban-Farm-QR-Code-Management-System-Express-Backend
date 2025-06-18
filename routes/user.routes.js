import { Router } from "express"
import { LoginController } from "../controllers/user.controllers.js"

const userRouter = Router()
userRouter.post('/login', LoginController)

export default userRouter