import userService from '../services/userService'

const handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    // !email = [email ==='' || email === null || email === undefined]
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameters',
        })
    }
    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    })
}
const handleGetAllUsers = async (req, res) => {
    let id = req.query.id //All || id
    if (id) {
        let users = await userService.getAllUsers(id)

        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            users,
        })
    }
    return res.status(500).json({
        errCode: 1,
        errMessage: 'Missing required fields',
    })
}
const handleCreateNewUser = async (req, res) => {
    let data = req.body
    console.log(data)
    let message = await userService.createNewUser(data)

    return res.status(200).json(message)
}

const handleEditUser = async (req, res) => {
    let data = req.body
    if (!data.id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing parameters',
        })
    }
    let message = await userService.editUser(data)
    return res.status(200).json(message)
}

const handleDeleteUser = async (req, res) => {
    let data = req.body
    if (!data.id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing id',
        })
    }
    let message = await userService.deleteUser(data.id)
    return res.status(200).json(message)
}

const getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
}
