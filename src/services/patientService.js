import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}}&doctorId=${doctorId}`
    return result
}
let postBookAppoinmentService = data => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.timeType ||
                !data.date ||
                !data.fullName
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                })
            } else {
                let token = uuidv4()
                emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectlink: buildUrlEmail(data.doctorId, token),
                })
                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    },
                })
                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            timeType: data.timeType,
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                        },
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor successfully',
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let postVerifyAppoinmentService = data => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                })
            } else {
                let appoinment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1',
                    },
                    raw: false, // có thể Update
                })
                if (appoinment) {
                    appoinment.statusId = 'S2'
                    await appoinment.save()

                    resolve({
                        errCode: 0,
                        errMessage: 'Updated appoinment successfully!!!',
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage:
                            'Aappoinment does not exist yet or has been avtice',
                    })
                }
            }
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    postBookAppoinmentService,
    postVerifyAppoinmentService,
}
