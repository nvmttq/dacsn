const courses = require("../models/courseModel.js");
const groups = require("../models/groupModel.js");
const usertest = require("../models/userModel.js");
const GradesModel = require("../models/gradeModel.js");
const ExamModel = require("../models/examModel.js");

class HomeController {
  index(req, res) {
    //console.log("session user in homeController", req.session.user);
    res.json({ msg: "HELLO INDEX HGOME" });
  }

  async joinCourse(req, res) {
    try {
      const course = await courses.findOne({ token: req.body.courseToken });

      if (course) {
        let user = await usertest.findOne({
          username: req.body.user.username,
        });
   
        const isUserInCourse = course.participants
          .toObject()
          .find((u) => u.userID === user.username);
        if (isUserInCourse) {
          res.json({
            severity: "info",
            msg: `Bạn đã tham gia khóa học này trước đó`,
          });
        } else {
          course.participants.push({
            userID: user.username,
            nameDisplay: user.toObject().name,
            isTeachingAssitant: user.role === "TG",
            isTeacher: user.role === "GV",
          });
          user.courses.push(req.body.courseToken)
          await course.save();
          await user.save();

          res.json({
            severity: "success",
            msg: `Bạn đã được thêm vào khóa học ${course.title}`,
          });
        }
      } else {
        res.json({
          severity: "warn",
          msg: "Khóa học không tồn tại",
        });
      }
    } catch (err) {
      res.json({
        severity: "error",
        msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !",
        a: err.message,
      });
    }
  }

  async getCourseWithUserName(req, res) {
    try {
      let user = await usertest.findOne({ username: req.params.username });
      user = user.toObject();
      // console.log("USER COURSES", user);
      let coursesOfUser = [];
      const cc = await courses.find({});
      cc.forEach((data) => {
        // console.log("DATA TOEKN ", data, user.courses);
        if (user.courses.includes(data.token)) {
          coursesOfUser.push(data);
        }
      });
      res.json(coursesOfUser);
    } catch (err) {
      res.json({ msg: "dont have cr" });
    }
  }

  async getGroupWithUserName(req, res) {
    try {
      let user = await usertest.findOne({ username: req.params.username });
      user = user.toObject();
      // console.log("USER GROUPS", user);
      let groupsOfUser = [];
      const gg = await groups.find({});
      gg.forEach((data) => {
        // console.log("DATA ID ", data, user.groups);
        if (user.groups.includes(data.id)) {
          groupsOfUser.push(data);
        }
      });
      res.json(groupsOfUser);
    } catch (err) {
      res.json({ msg: "dont have gr" });
    }
  }

  async getGradeOfUserFromCourse(req, res) {
    // console.log(req.body)
    try {
      const grades = await GradesModel.find({
        courseToken: req.body.courseToken,
        idUser: req.body.username,
      });
      if (grades) {
        res.json(grades);
      } else res.json({ msg: "DONT MATCH ANY GRADES" });
    } catch (err) {
      res.json({ msg: "ERROR GRADES !!!" });
    }
  }
  
  async getReviewExamForUserInCourse(req, res) {
    const { examToken } = req.params;

    try {
      const exam = await ExamModel.findOne({id: examToken});
      let totalCorrect = 0;
      exam.questions.forEach(e => {
        e.choice.forEach(c => {
          c.userChoose.forEach(username => {

            if(c.name === e.answer && req.body.username === username) totalCorrect++;
          })
        });
      });
      res.json({
        exam, totalCorrect
      });
    } catch (err) {
      console.log(err)
      res.json({msg :err})
    }
  }

  async getExamForUserInCourse(req, res) {
    
  }
}

module.exports = new HomeController();
