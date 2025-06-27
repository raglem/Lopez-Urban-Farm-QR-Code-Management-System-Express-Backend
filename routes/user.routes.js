import { Router } from "express"
import { AddUserController, EditRoleController, EditUserController, GetAllUsersController, LoginController, RemoveUserController, ResetPasswordController } from "../controllers/user.controllers.js"
import verifyOwner from "../middleware/verifyOwner.js"
import verifyToken from "../middleware/verifyToken.js"

const userRouter = Router()
userRouter.post('/login', LoginController)

// middleware to verify access token
userRouter.use(verifyToken)
userRouter.get('/', GetAllUsersController)
userRouter.put('/:_id', EditUserController)
userRouter.patch('/reset-password/:_id', ResetPasswordController)

// middleware to verify user is an owner with administrative priveleges
userRouter.use(verifyOwner)

userRouter.post('/add-user', AddUserController)
userRouter.delete('/remove-user/:_id', RemoveUserController)
userRouter.patch('/edit-role/:_id', EditRoleController)

export default userRouter