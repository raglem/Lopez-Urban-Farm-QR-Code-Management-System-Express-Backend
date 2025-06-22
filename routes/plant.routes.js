import verifyToken from "../middleware/verifyToken.js"
import { Router } from "express"
import { GetPlantController, GetPlantsController, AddPlantController, UpdatePlantController, RemovePlantController } from "../controllers/plant.controllers.js"

const plantRouter = Router()

plantRouter.get('/:id', GetPlantController)
plantRouter.get('/', GetPlantsController)

// Apply token middlware to verify user can modify plants
plantRouter.use(verifyToken)

plantRouter.post('/add', AddPlantController)
plantRouter.patch('/update', UpdatePlantController)
plantRouter.delete('/remove', RemovePlantController)

export default plantRouter