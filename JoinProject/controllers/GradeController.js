const GroupModel = require("../models/groupModel.js");
const UserModel = require("../models/userModel.js");
const AssignmentModel = require("../models/assignmentModel.js");
const CourseModel = require("../models/courseModel.js");
const ExamModel = require("../models/examModel.js");
const GradeModel = require("../models/gradeModel.js");

const shortid = require('shortid');

module.exports = {
  gradeForTeacher: async (req, res) => {
    const {courseToken} = req.body;
    console.log(req.body)
    const course = await CourseModel.findOne({token: courseToken});
    const exams = await ExamModel.find({courseToken: courseToken});
    const assignments = await AssignmentModel.find({courseToken: courseToken});

    res.json({
      course,
      exams,
      assignments
    })
  }
};
