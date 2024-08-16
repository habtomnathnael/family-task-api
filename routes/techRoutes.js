const express = require('express')
const router = express.Router()
const techController = require('../controllers/techController')

router.route('/')
    .post(techController.createNewTechAdmin)
module.exports = router
