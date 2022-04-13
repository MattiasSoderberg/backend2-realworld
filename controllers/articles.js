const { createArticle, getAllArticles, getSelectedArticles } = require("../models/Article")
const { getUserByUsername } = require("../models/User")
const { createTags } = require("../models/Tag")

const createNewArticle = async (req, res) => {
    const { title, description, body, tagList } = req.body.article
    const articleData = {
        title,
        description,
        body,
        tagList,
        author: req.user.userId
    }
    const article = await createArticle(articleData)
    if (article) {
        if (article.tagList) {
            try {
                const modifiedTags = article.tagList.map(tag => ({ tag }))
                await createTags(modifiedTags)
            }
            catch (err) {
                console.log(err)
            }
        }
        res.json({ article })
    } else {
        res.sendStatus(400)
    }
}

const getArticles = async (req, res) => {
    let articles = []
    if (Object.keys(req.query).length) {
        const queryKey = Object.keys(req.query)[0]
        const queryValue = Object.values(req.query)[0]
        if (queryKey === "author") {
            const user = await getUserByUsername(queryValue)
            if (user) {
                articles = await getSelectedArticles({ author: user._id })
            }
        } else if (queryKey === "tag") {
            articles = await getSelectedArticles({ tagList: { $in: queryValue } })
        }
    } else {
        articles = await getAllArticles({})
    }

    const articlesCount = articles.length

    if (articles) {
        res.json({ articles, articlesCount })
    } else {
        res.sendStatus(400)
    }
}

module.exports = { createNewArticle, getArticles }