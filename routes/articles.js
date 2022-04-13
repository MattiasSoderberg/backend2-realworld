const express = require("express")

const { createNewArticle, getArticles, getSingleArticleBySlug, updateSingleArticle } = require("../controllers/articles")

const router = express.Router()

router.post("/", createNewArticle)

router.get("/", getArticles)

router.get("/:slug", getSingleArticleBySlug)

router.put("/:slug", updateSingleArticle)

module.exports = router