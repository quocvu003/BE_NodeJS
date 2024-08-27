import specialtyService from '../services/specialtyService'

let createSpeacialty = async (req, res) => {
    try {
        let info = await specialtyService.createSpeacialtyService(req.body)
        return res.status(200).json(info)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
let getAllSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.getAllSpecialtyService(req.body)
        return res.status(200).json(info)
    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error forms server...',
        })
    }
}
export default { createSpeacialty, getAllSpecialty }
