import patientService from '../services/patientService'
let postBookAppoinment = async (req, res) => {
    try {
        let info = await patientService.postBookAppoinmentService(req.body)
        return res.status(200).json(info)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let postVerifyBookAppoinment = async (req, res) => {
    try {
        let info = await patientService.postVerifyAppoinmentService(req.body)
        return res.status(200).json(info)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
module.exports = {
    postBookAppoinment,
    postVerifyBookAppoinment,
}
