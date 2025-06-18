import { Router } from "express"
import { AddUserController, EditRoleController, GetAllUsersController, LoginController, RemoveUserController } from "../controllers/user.controllers.js"
import verifyOwner from "../middleware/verifyOwner.js"
import verifyToken from "../middleware/verifyToken.js"

const userRouter = Router()
userRouter.post('/login', LoginController)

// middleware to verify access token
userRouter.use(verifyToken)

userRouter.get('/', GetAllUsersController)

// middleware to verify user is an owner with administrative priveleges
userRouter.use(verifyOwner)

userRouter.post('/add-user', AddUserController)
userRouter.delete('/remove-user', RemoveUserController)
userRouter.patch('/edit-role', EditRoleController)

export default userRouter