import Plant from '../models/plant.models.js'
import Leader from '../models/leader.models.js';

export const GetQuizController = async (req, res) => {
    try{
        // The number of plants we need to fetch is half the number of questions. 
        // A plant is 2 questions because we divide the name and the species/image on the client.
        const numOfQuestions = 12
        // Fetch plants with images
        const plantsWithImages = await Plant.aggregate([
            { $match: { image: { $exists: true, $ne: null } } },
            { $sample: { size: numOfQuestions / 4 } }
        ]);
        // Fetch other plants without images, get more if there are not enough plants with images
        const otherPlants = await Plant.aggregate([
            { $match: { _id: { $nin: plantsWithImages.map(plant => plant._id) } } },
            { $sample: { size: 2 * (numOfQuestions / 4) - plantsWithImages.length } }
        ]);
        const plants = [...plantsWithImages, ...otherPlants]
        const questions = plants.map((plant, i) => {
            // Create a question based on either the image or species
            if(plant.image){
                return {
                    name: plant.name,
                    image: plant.image.url,
                    questionType: 'image'
                }
            }
            else{
                return {
                    name: plant.name,
                    species: plant.species,
                    questionType: 'species'
                }
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Questions successfully retrieved',
            questions,
        })
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error', error: err })
    }
}
export const GetLeaderboardController = async (req, res) => {
    try{
        // Fetch the leaderboard data from the database
        const leaderboard = await Leader.find().sort({ score: -1 }).limit(50);
        return res.status(200).json({
            success: true,
            message: 'Leaderboard successfully retrieved',
            leaderboard,
        })
    }
    catch(err){
        return res.status(500).json({ success: false, message: 'Server Error', error: err })
    }
}
export const AddScoreToLeaderboard = async (req, res) => {
    try{
        const _id = req.params._id
        const { name, score } = req.body

        // If there is no id, create a new leader document
        if(!_id){
            const newLeader = new Leader({
                name, 
                score
            })
            await newLeader.save()
            return res.status(200).json({
                success: true,
                message: 'Leader successfully added',
                leader: newLeader,
            })
        }
        else{
            const leader = await Leader.findById(_id)
            if(!leader) return res.status(404).json({ success: false, message: 'Leader not found'})
            if(leader.score < score)    return res.status(400).json({ success: false, message: 'The new score is worse than the current score' })
            leader.name = name
            leader.score = score
            await leader.save()
            return res.status(200).json({
                success: true,
                message: 'Leader successfully updated',
                leader
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: 'Server Error', error: err })
    }
}
