import verifyToken from "../middleware/verifyToken.js"
import { Router } from "express"
import { GetPlantController, GetPlantsController, AddPlantController, UpdatePlantController, RemovePlantController } from "../controllers/plant.controllers.js"
import upload from "../middleware/multer.js"

const plantRouter = Router()

plantRouter.get('/:id', GetPlantController)
plantRouter.get('/', GetPlantsController)

// Apply token middlware to verify user can modify plants
plantRouter.use(verifyToken)

// Apply multer middleware for image upload and file parsing
plantRouter.post('/add', upload.single('image'), AddPlantController)
plantRouter.patch('/update', upload.single('image'), UpdatePlantController)

plantRouter.delete('/remove', RemovePlantController)

export default plantRouter