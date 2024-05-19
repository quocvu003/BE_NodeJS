import db from '../models/index'

let getTopDoctorHomeService = limitInput => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'genderData', attribute: ['valueEN', 'valueVI'] },
                    { model: db.Allcode, as: 'positionData', attribute: ['valueEN', 'valueVI'] },
                ],
                raw: true,
                nest: true,
            })

            resolve({
                errCode: 0,
                data: users,
            })
        } catch (err) {
            reject(err)
        }
    })
}

let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        let doctors = await db.User.findAll({
            where: { roleId: 'R2' },
            attributes: {
                exclude: ['password', 'image'],
            },
        })
        resolve({
            errCode: 0,
            data: doctors,
        })
        try {
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = { getTopDoctorHomeService, getAllDoctorsService }
