import express from 'express'
import homeController from '../controllers/homeController'
import userController from '../controllers/userController'
import doctorController from '../controllers/doctorController'
let router = express.Router()

const initWebRoutes = app => {
    router.get('/', homeController.getHomePage)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)

    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor)
    router.get('/api/get-info-doctor', doctorController.getInfoDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)

    return app.use('/', router)
}

module.exports = initWebRoutes
