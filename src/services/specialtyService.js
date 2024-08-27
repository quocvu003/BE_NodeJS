import db from '../models/index'
require('dotenv').config()

let createSpeacialtyService = data => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required',
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Save Specialty successfully',
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({})
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString(
                        'binary'
                    )
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data,
            })
        } catch (e) {
            reject(e)
        }
    })
}
export default {
    createSpeacialtyService,
    getAllSpecialtyService,
}
