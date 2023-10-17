const express = require('express')
const router = express.Router()
const homeController = require('../controllers/HomeController.js')
//course
router.post('/courses/joinCourse', homeController.joinCourse)
router.post('/courses/:courseToken/grade', homeController.getGradeOfUserFromCourse);

//exam and review
router.post('/exam/review/:examToken', homeController.getReviewExamForUserInCourse);
router.post('/exam/:examToken', homeController.getExamForUserInCourse);


//user
router.get('/groups/:username', homeController.getGroupWithUserName);

router.get('/courses/:username', homeController.getCourseWithUserName)
router.get('/', homeController.index)

router.post('/course/content', homeController.getContentCourse);

router.get('/load-dkmh', homeController.loadDkmh);

module.exports = router