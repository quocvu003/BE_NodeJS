import db from '../models/index'
import bcrypt from 'bcrypt'
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId'],
                    where: { email: email },
                    raw: true,
                })

                if (user) {
                    // compare password
                    let check = await bcrypt.compareSync(password, user.password)

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
                resolve(user)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = { handleUserLogin }
