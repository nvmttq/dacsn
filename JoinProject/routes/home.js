const express = require('express')
const router = express.Router()
const homeController = require('../controllers/HomeController.js')



router.post('/login', homeController.login);
router.post('/groups', homeController.getAllGroup);
router.post('/KhoaHoc', homeController.getAllCourse);
router.post('/khoahoc/:username', homeController.getCourseWithUserName)
router.post('/:courseToken', homeController.getCourse)
router.get('/', homeController.index)

module.exports = router