import { Router } from 'express'
import { AddGardenController, GetGardenController, GetGardensController } from '../controllers/garden.controllers.js'
import verifyToken from '../middleware/verifyToken.js'

const gardenRouter = Router()

gardenRouter.get('/', GetGardensController)
gardenRouter.get('/:id', GetGardenController)

gardenRouter.use(verifyToken)

gardenRouter.post('/add', AddGardenController)

export default gardenRouter