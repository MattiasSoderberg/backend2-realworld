const { getUserByUsername } = require("../models/User")

const getUserProfile = async (req, res) => {
    const { username } = req.params
    const user = await getUserByUsername(username)

    if (user) {
        const profile = {
            username: user.username,
            bio: user.bio,
            image: user.image
        }
        res.json({ profile })
    } else {
        res.sendStatus(400)
    }
}

module.exports = { getUserProfile }