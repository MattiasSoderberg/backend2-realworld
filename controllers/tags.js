const { getAllTags } = require("../models/Tag")

const getTags = async (req, res) => {
    const tags = await getAllTags()

    if (tags) {
        const tagsToString = tags.map(tag => tag.tag)
        res.json({ tags: tagsToString })
    } else {
        res.sendStatus(400)
    }
}

module.exports = { getTags }