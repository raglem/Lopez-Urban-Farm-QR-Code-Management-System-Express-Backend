import { Router } from 'express'
import { 
    AddGardenController, AddGardenImage, DeleteGardenController, 
    DeleteGardenImage, GetGardenController, GetGardensController, 
    GetGardensFullController, UpdateGardenController } from '../controllers/garden.controllers.js'
import verifyToken from '../middleware/verifyToken.js'
import upload from "../middleware/multer.js"
import attachAuth from '../middleware/attachAuth.js'

const gardenRouter = Router()

gardenRouter.use(attachAuth)
gardenRouter.get('/', GetGardensController)
gardenRouter.get('/full', GetGardensFullController)
gardenRouter.get('/:id', GetGardenController)

gardenRouter.use(verifyToken)

gardenRouter.post('/add', AddGardenController)
gardenRouter.patch('/update/:id', UpdateGardenController)
gardenRouter.delete('/remove/:id', DeleteGardenController)

// Apply multer middleware for image upload and file parsing
gardenRouter.post('/add-image/:id', upload.single('image'), AddGardenImage)
gardenRouter.delete('/delete-image/:id', upload.single('image'), DeleteGardenImage)

export default gardenRouter