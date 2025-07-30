import Garden from "../models/garden.models.js";
import isAuthenticated from "../utils/isAuthenticated.js";
import cloudinary from "../utils/cloudinary.js";

export const GetGardensController = async (req, res) => {
    try{
        let gardens = await Garden.find()
        if(!(await isAuthenticated(req))){
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
        return res.status(500).json({ success: false, message: 'Server Error', error: err })
    }
}
export const GetGardenController = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Garden id is required' });
        }
        const garden = await Garden.findById(id);
        if (!garden || (garden.visibility === false && !(await isAuthenticated()))) {
            return res.status(404).json({ success: false, message: 'Garden not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Garden successfully retrieved',
            data: garden,
        })
    }
    catch(err){
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

        // Handle image upload if it exists
        if(req.file){
            const image = await cloudinary.uploader.upload(req.file.path);
            if (!image) {
                return res.status(500).json({ success: false, message: 'Image upload failed' });
            }
            garden.image = {
                url: image.secure_url,
                public_id: image.public_id
            };
        }

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
// export const UpdateGardenController = async (req, res) => {
//     const { id } = req.params
//     if (!id) {
//         return res.status(400).json({ success: false, message: 'Garden id is required' });
//     }

//     const garden = await Garden.findById(id)
//     if (!garden) {
//         return res.status(404).json({ success: false, message: 'Garden not found' });
//     }

//     const fields = ['name', 'description', ]
// }