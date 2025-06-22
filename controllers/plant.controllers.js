import Plant from '../models/plant.models.js'
export const GetPlantsController = async (req, res) => {
    try{
        const plants = await Plant.find()
        return res.status(200).json({
            success: true,
            message: 'Plants successfully retrieved',
            data: plants,
        })
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error', error: err })
    }
}
export const GetPlantController = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Plant id is required' });
        }
        const plant = await Plant.findById(id);
        if (!plant) {
            return res.status(404).json({ success: false, message: 'Plant not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Plant successfully retrieved',
            data: plant,
        })
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const AddPlantController = async (req, res) => {
    try{
        // Check if all required fields are present in the request body
        const { name, species, description } = req.body
        if(!name || !species || !description){
            return res.status(400).json({ success: false, message: 'All fields are required'})
        }
        if(await Plant.findOne({ name })){
            return res.status(400).json({ success: false, message: 'Plant with this name already exists' })
        }

        // Create a new plant document
        const plant = new Plant({
            name, species, description
        })
        await plant.save()
        return res.status(201).json({ 
            success: true, 
            message: `Plant ${name} successfully added`, 
            data: plant
        })
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const UpdatePlantController = async (req, res) => {
    try{
        // Define fields that can be updated and check if the id is present in the request body
        const fields = ['name', 'species', 'description']
        const { id } = req.body
        if(!id){
            return res.status(400).json({ success: false, message: 'Plant id field is required'})
        }
        const plant = await Plant.findById(id)
        if(!plant){
            return res.status(404).json({ success: false, message: 'Plant not found' })
        }
        // Check if each field is present in the request body and change any fields that are different from the existing document
        for (const field of fields) {
            if(!req.body[field]){
                return res.status(400).json({ success: false, message: `${fields[field]} is required` })
            }
            if(req.body[field] !== plant[field]){
                plant[field] = req.body[field]
            }
        }
        await plant.save()
        return res.status(200).json({ 
            success: true, 
            message: `Plant ${req.body.name} successfully updated`, 
            data: plant
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const RemovePlantController = async (req, res) => {
    try{
        // Check request body for plant id and retrieve from database
        const { id } = req.body
        if(!id){
            return res.status(400).json({ success: false, message: 'Plant id field is required'})
        }
        const plantExists = await Plant.exists({ _id: id })
        if(!plantExists){
            return res.status(404).json({ success: false, message: 'Plant not found' })
        }

        // Remove the plant from the database
        const deletedPlant = await Plant.deleteOne({ _id: id })
        return res.status(200).json({ success: true, message: `Plant ${deletedPlant.name} successfully removed` })
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
