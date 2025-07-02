import { Router } from 'express'
import { GetQuizController, GetLeaderboardController, AddScoreToLeaderboard } from '../controllers/quiz.controllers.js'

const quizRouter = Router()

quizRouter.get('/', GetQuizController)
quizRouter.get('/leaderboard', GetLeaderboardController)
quizRouter.post('/add-score/:_id?', AddScoreToLeaderboard)

export default quizRouter