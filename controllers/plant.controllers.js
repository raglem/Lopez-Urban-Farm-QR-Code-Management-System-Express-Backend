import Plant from '../models/plant.models.js'
import cloudinary from '../utils/cloudinary.js'
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
        console.log(err)
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

        // Handle image upload if it exists
        if(req.file){
            const image = await cloudinary.uploader.upload(req.file.path);
            if (!image) {
                return res.status(500).json({ success: false, message: 'Image upload failed' });
            }
            plant.image = {
                url: image.secure_url,
                public_id: image.public_id
            };
        }

        await plant.save()

        return res.status(201).json({ 
            success: true, 
            message: `Plant ${plant.name} successfully added`, 
            data: plant
        })
    }
    catch(err){
        console.log(err)
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
                continue
            }
            if(req.body[field] !== plant[field]){
                plant[field] = req.body[field]
            }
        }
        // Check if an image is being replaced or should be deleted
        if((req.file || req.body.deleteImage === 'true') && plant.image){
            const old_public_id = plant.image?.public_id

            // If the image is being deleted, remove the image field
            plant.image = undefined

            // If an old image exists, delete it from Cloudinary
            if(old_public_id){
                await cloudinary.uploader.destroy(old_public_id)
            }
        }
        // Check if an image is being uploaded and handle it
        if(req.file){
            // Upload the new image to Cloudinary
            const image = await cloudinary.uploader.upload(req.file.path)
            if(!image){
                return res.status(500).json({ success: false, message: 'Image upload failed' })
            }
            // Update the plant's image field with the new image details
            plant.image = {
                url: image.secure_url,
                public_id: image.public_id
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

        // Check if the deleted plant has an image and delete it from Cloudinary
        if(deletedPlant.image && deletedPlant.image.public_id){
            await cloudinary.uploader.destroy(deletedPlant.image.public_id)
        }

        return res.status(200).json({ success: true, message: `Plant ${deletedPlant.name} successfully removed` })
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
