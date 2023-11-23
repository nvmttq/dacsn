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
  },

  gradeForStudent: async (req, res) => {
    const {courseToken, username} = req.body;

    const exams = await ExamModel.find({courseToken: courseToken, 'userStatus.userID': username});
    const assignments = await AssignmentModel.find({courseToken: courseToken, 'userStatus.participants':  username});

    res.json({
      exams: exams.map(ex => {
        ex.userStatus = ex.userStatus.filter(us => us.userID === username);
        return ex;
      }),
      assignments: assignments.map(assign => {
        assign.userStatus = assign.userStatus.filter(us => {
          return us.participants.find(us => us === username)
        }); 
        return assign;
      }),
    })
  },

  updatePercent: async (req, res) => {
    const {idNeedUpdate} = req.body;

    const exams = await ExamModel.find({});
    const assignments = await AssignmentModel.find({});
    console.log(idNeedUpdate)
    exams.forEach(async ex => {
      if(idNeedUpdate[ex.id]) {
        ex.percent = idNeedUpdate[ex.id];
        await ex.save();
      }
    })
    
    assignments.forEach(async assign => {
      if(idNeedUpdate[assign.assignmentToken]) {
        assign.percent = idNeedUpdate[assign.assignmentToken];
        await assign.save();
      }
    })

    
    res.json("aaa")
  }
};
