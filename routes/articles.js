const express = require("express")

const {
    createNewArticle,
    getArticles,
    getSingleArticleBySlug,
    updateSingleArticle,
    favorieArticle,
    unFavoriteArticle
} = require("../controllers/articles")

const router = express.Router()

router.post("/", createNewArticle)

router.get("/", getArticles)

router.get("/:slug", getSingleArticleBySlug)

router.put("/:slug", updateSingleArticle)

router.post("/:slug/favorite", favorieArticle)

router.delete("/:slug/favorite", unFavoriteArticle)

module.exports = router