import Garden from "../models/garden.models.js";
import Plant from "../models/plant.models.js";
import cloudinary from "../utils/cloudinary.js";

export const GetGardensController = async (req, res) => {
    try{
        let gardens = await Garden.find()
        if(req.isAuthenticated === false){
            gardens = gardens.filter(g => g.visibility === true)
        }
        return res.status(200).json({
            success: true,
            message: 'Gardens successfully retrieved',
            data: gardens,
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const GetGardenController = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Garden id is required' });
        }
        const garden = await Garden.findById(id);
        if (!garden || (garden.visibility === false && req.isAuthenticated === false)) {
            return res.status(404).json({ success: false, message: 'Garden not found' });
        }

        const plants = await Plant.find({ garden: id}).select('-garden')
        const gardenWithPlants = {
            ...garden.toObject(),
            plants
        }
        return res.status(200).json({
            success: true,
            message: 'Garden successfully retrieved',
            data: gardenWithPlants,
        })
    }
    catch(err){
        console.error(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const GetGardensFullController = async (req, res) => {
    try{
        let gardens = await Garden.find()
        if(req.isAuthenticated === false){
            gardens = gardens.filter(g => g.visibility === true)
        }
        gardens = await Promise.all(gardens.map(async (garden) => {
            // Populate the plants for each garden and filter based on authentication status
            let plants = await Plant.find({ garden: garden._id }).select('-garden')
            if(req.isAuthenticated === false){
                plants = plants.filter(p => p.visibility === true)
            }
            return {
                ...garden.toObject(),
                plants
            }
        }))
        return res.status(200).json({
            success: true,
            message: 'Gardens successfully retrieved',
            data: gardens,
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const AddGardenController = async (req, res) => {
    try{
        const { name, description, visibility } = req.body
        if(!name || !description || !visibility){
            return res.status(400).json({ success: false, message: 'All fields are required to create a garden' })
        }
        if(await Garden.findOne({ name })){
            return res.status(400).json({ success: false, message: `Garden with name ${name} already exists` })
        }

        const garden = new Garden({
            name, description, visibility
        })

        await garden.save()

        return res.status(201).json({ 
            success: true, 
            message: `Garden ${garden.name} successfully added`, 
            data: garden
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const UpdateGardenController = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'Garden id is required' });
    }

    try{
        const garden = await Garden.findById(id)
        if (!garden) {
            return res.status(404).json({ success: false, message: 'Garden not found' });
        }
    
        const fields = ['name', 'description']
        for(const field of fields){
            if(req.body[field]){
                console.log(`Updating field ${field} with value: ${req.body[field]}`)
                garden[field] = req.body[field]
            }
        }
        await garden.save()
        return res.status(200).json({ success: true, message: 'Garden successfully updated', data: garden });
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const AddGardenImage = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'Garden id is required' });
    }
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    try {
        const garden = await Garden.findById(id)
        if (!garden) {
            return res.status(404).json({ success: false, message: 'Garden not found' });
        }
    
        const image = await cloudinary.uploader.upload(req.file.path);
        if(!image){
            return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        const newImage = {
            url: image.secure_url,
            public_id: image.public_id
        }
        garden.images.push(newImage)

        await garden.save();

        return res.status(200).json({
            success: true,
            message: 'Image successfully added to garden',
            data: newImage
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error', error });
    }
}
export const DeleteGardenImage = async (req, res) => {
    // Check for the garden id
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'Garden id is required' });
    }

    // Get the image public id in the request body
    const { public_id } = req.body
    if (!public_id) {
        return res.status(400).json({ success: false, message: 'Image public id is required' });
    }

    try{
        // Check if the garden exists
        const garden = await Garden.findById(id)
        if (!garden) {
            return res.status(404).json({ success: false, message: 'Garden not found' });
        }

        const image = garden.images.find(image => image.public_id === public_id)
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found in garden' });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(public_id);

        // Delete the image from the garden document
        garden.images = garden.images.filter(image => image.public_id !== public_id);

        await garden.save()
        return res.status(204).json({ success: true, message: 'Image successfully deleted from garden' });
    }
    catch(err){
        console.error(err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}
export const DeleteGardenController = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'Garden id is required' });
    }

    try {
        const garden = await Garden.findById(id)
        if (!garden) {
            return res.status(404).json({ success: false, message: 'Garden not found' });
        }

        // Delete all images associated with the garden from Cloudinary
        for (const image of garden.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        await Garden.deleteOne({ _id: id})

        return res.status(204).json({ success: true, message: 'Garden successfully deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error', error });
    }
}