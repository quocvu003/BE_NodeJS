import { where } from 'sequelize'
import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

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
        try {
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
        } catch (err) {
            reject(err)
        }
    })
}

let saveInfoDoctorService = data => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.doctorId ||
                !data.contentHTML ||
                !data.contentMarkdown ||
                !data.action ||
                !data.selectPrice ||
                !data.selectPayment ||
                !data.selectProvince ||
                !data.nameClinic ||
                !data.addressClinic ||
                !data.note
            ) {
                reject({
                    errCode: -1,
                    errMessage: 'Missing parameter ',
                })
            } else {
                if (data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    })
                } else if (data.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = data.contentHTML
                        doctorMarkdown.contentMarkdown = data.contentMarkdown
                        doctorMarkdown.description = data.description
                        doctorMarkdown.updateAt = new Date()
                        await doctorMarkdown.save()
                    }
                }
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: data.doctorId,
                    },
                    raw: false,
                })
                if (doctorInfor) {
                    doctorInfor.doctorId = data.doctorId
                    doctorInfor.priceId = data.selectPrice
                    doctorInfor.provinceId = data.selectProvince
                    doctorInfor.paymentId = data.selectPayment
                    doctorInfor.nameClinic = data.nameClinic
                    doctorInfor.addressClinic = data.addressClinic
                    doctorInfor.note = data.note
                    await doctorInfor.save()
                } else {
                    await db.Doctor_Infor.create({
                        doctorId: data.doctorId,
                        priceId: data.selectPrice,
                        provinceId: data.selectProvince,
                        paymentId: data.selectPayment,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        note: data.note,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save info successfully',
                })
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}
let getDoctorByIdService = id => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter',
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEN', 'valueVI'],
                        },
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}

                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
let bulkCreateScheduleService = data => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                // get all existing data
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.formatedDate,
                    },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                })

                // compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })

                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters',
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEN', 'valueVI'],
                        },
                    ],
                    raw: false,
                    nest: true,
                })

                if (!dataSchedule) dataSchedule = []
                resolve({
                    errCode: 0,
                    data: dataSchedule,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorHomeService,
    getAllDoctorsService,
    saveInfoDoctorService,
    getDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleByDateService,
}
