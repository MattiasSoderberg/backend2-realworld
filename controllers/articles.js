const { createArticle, getAllArticles, getSelectedArticles, getArticleBySlug } = require("../models/Article")
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
        } else if (queryKey === "favorited") {
            const user = await getUserByUsername(queryValue)
            if (user) {
                articles = await getSelectedArticles({ _id: { $in: user.favorited } })
            }
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

const getSingleArticleBySlug = async (req, res) => {
    const { slug } = req.params
    const article = await getArticleBySlug(slug)
    if (article) {
        res.json({ article })
    } else {
        res.sendStatus(404)
    }
}

const updateSingleArticle = async (req, res) => {
    const { slug } = req.params
    const article = await getArticleBySlug(slug)
    if ( article ) {
        // article.title = req.body.article.title
        // article.description = req.body.article.description
        article.body = req.body.article.body
        // article.tagList = req.body.article.tagList
        await article.save()
        res.json({ article })
    } else {
        res.sendStatus(400)
    }
}

const favorieArticle = async (req, res) => {
    const user = await getUserByUsername(req.user.username)
    if (user) {
        const article = await getArticleBySlug(req.params.slug)
        if (article) {
            user.favorited.addToSet(article._id)
            article.favoritesCount += 1
            article.favorited = true
            await user.save()
            await article.save()
            res.json({ article })
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }
}

const unFavoriteArticle = async (req, res) => {
    const user = await getUserByUsername(req.user.username)
    if (user) {
        const article = await getArticleBySlug(req.params.slug)
        if (article) {
            user.favorited.pop(article._id)
            article.favoritesCount -= 1
            article.favorited = false
            await user.save()
            await article.save()
            res.json({ article })
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }
}

module.exports = { 
    createNewArticle,
    getArticles,
    getSingleArticleBySlug,
    updateSingleArticle,
    favorieArticle,
    unFavoriteArticle
}