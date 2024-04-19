import express from 'express'
import homeController from '../controllers/homeController'
import userController from '../controllers/userController'
let router = express.Router()

const initWebRoutes = app => {
    router.get('/', homeController.getHomePage)
    router.post('/api/login', userController.handleLogin)

    return app.use('/', router)
}

module.exports = initWebRoutes
