const express = require('express')
const router = express.Router()
const homeController = require('../controllers/HomeController.js')



router.post('/groups/:username', homeController.getGroupWithUserName);
router.post('/courses/:username', homeController.getCourseWithUserName)
router.get('/', homeController.index)

module.exports = router