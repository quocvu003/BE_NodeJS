import db from '../models/index'

const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('homePage.ejs', {
            data: JSON.stringify(data),
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getHomePage }
