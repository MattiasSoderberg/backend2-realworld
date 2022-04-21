const { getUserByUsername, findAndUpdateUser } = require("../models/User")

const getUser = async (req, res) => {
    const user = await getUserByUsername(req.user.username)
    if (user) {
        res.json({ user })
    } else {
        res.sendStatus(400)
    }
}

const updateUser = async (req, res) => {
    // const user = await getUserByUsername(req.user.username)
    // if (user) {
    //     user.username = req.body.user.username
    //     user.email = req.body.user.email
    //     user.password = req.body.user.password
    //     user.bio = req.body.user.bio
    //     user.image = req.body.user.image
    //     await user.save()
    //     res.json({ user })
    // } else {

    // }
    const userData = {
        username: req.body.user.username,
        email: req.body.user.email,
        password: req.body.user.password,
        bio: req.body.user.bio,
        image: req.body.user.image
    }
    const user = await findAndUpdateUser(req.user.username, userData)

    if (user) {
        res.json({ user })
    } else {
        res.sendStatus(400)
    }
}

module.exports = { getUser, updateUser }