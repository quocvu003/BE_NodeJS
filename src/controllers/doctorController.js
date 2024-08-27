import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 10
    try {
        let response = await doctorService.getTopDoctorHomeService(+limit)
        return res.status(200).json(response)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsService()
        return res.status(200).json(doctors)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let postInfoDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.saveInfoDoctorService(req.body)
        return res.status(200).json(doctors)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let getInfoDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDoctorByIdService(req.query.id)
        return res.status(200).json(info)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateScheduleService(req.body)
        return res.status(200).json(info)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDateService(
            req.query.doctorId,
            req.query.date
        )
        return res.status(200).json(info)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorById(
            req.query.doctorId
        )

        return res.status(200).json(infor)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId)

        return res.status(200).json(infor)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getListPatientForDoctor(
            req.query.doctorId,
            req.query.date
        )

        return res.status(200).json(infor)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let sendRemedy = async (req, res) => {
    try {
        let infor = await doctorService.sendRemedyService(req.body)
        return res.status(200).json(infor)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getInfoDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
}
