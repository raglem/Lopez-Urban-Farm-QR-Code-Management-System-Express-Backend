import { Router } from 'express'
import { AddGardenController, AddGardenImage, DeleteGardenController, DeleteGardenImage, GetGardenController, GetGardensController, UpdateGardenController } from '../controllers/garden.controllers.js'
import verifyToken from '../middleware/verifyToken.js'
import upload from "../middleware/multer.js"

const gardenRouter = Router()

gardenRouter.get('/', GetGardensController)
gardenRouter.get('/:id', GetGardenController)

gardenRouter.use(verifyToken)

gardenRouter.post('/add', AddGardenController)
gardenRouter.patch('/update', UpdateGardenController)
gardenRouter.delete('/remove', DeleteGardenController)

// Apply multer middleware for image upload and file parsing
gardenRouter.post('/add-image/:id', upload.single('image'), AddGardenImage)
gardenRouter.delete('/delete-image/:id', upload.single('image'), DeleteGardenImage)

export default gardenRouter