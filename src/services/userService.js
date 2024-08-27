import db from '../models/index'
import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10)

let hashUserPassword = password => {
    try {
        let hashPassword = bcrypt.hashSync(password, salt) // 10 là số lượng rounds để tạo salt
        return hashPassword
    } catch (err) {
        throw err
    }
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: [
                        'id',
                        'email',
                        'password',
                        'roleId',
                        'firstName',
                        'lastName',
                    ],
                    where: { email: email },
                    raw: true,
                })

                if (user) {
                    // compare password
                    let check = await bcrypt.compareSync(
                        password,
                        user.password
                    )

                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = 'Ok'
                        delete user.password
                        userData.user = user
                    } else {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password'
                    }
                } else {
                    userData.errCode = 2
                    userData.errMessage = `User not found `
                }
            } else {
                // error
                userData.errCode = 1
                userData.errMessage = `Your email isn't exist in your system. `
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = email => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { email: email } })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password'],
                    },
                })
            }
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}
let createNewUser = data => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkEmail = await checkUserEmail(data.email)

            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already',
                })
            } else {
                let hashPasswordFromBcrypt = hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create New User Successfully',
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = userId => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId },
        })

        if (user) {
            await db.User.destroy({ where: { id: user.id } })
            resolve({
                errCode: 0,
                errMessage: 'The user is destroyed ',
            })
        } else {
            resolve({
                errCode: 2,
                errMessage: "The user isn't exist ",
            })
        }
    })
}

let editUser = data => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing parameter',
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            })

            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.phoneNumber = data.phoneNumber
                user.gender = data.gender
                user.positionId = data.positionId
                user.roleId = data.roleId
                if (data.avatar) {
                    user.image = data.avatar
                }
                await user.save()
                resolve({
                    errCode: 0,
                    errMessage: 'Update successful',
                })
            } else {
                reject({
                    errCode: 1,
                    errMessage: 'User not found',
                })
            }
        } catch (err) {
            reject(err)
        }
    })
}

const getAllCodeService = typeInput => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeInput) {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput },
                })

                res.errCode = 0
                res.data = allcode
                resolve(res)
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter ',
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    editUser,
    getAllCodeService,
}
