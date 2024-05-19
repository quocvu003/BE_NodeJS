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

module.exports = { getTopDoctorHome, getAllDoctors }
