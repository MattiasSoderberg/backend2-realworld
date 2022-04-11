const express = require("express")
const { getUserProfile } = require("../controllers/profiles")

const router = express.Router()

router.get("/:username", getUserProfile)

module.exports = router