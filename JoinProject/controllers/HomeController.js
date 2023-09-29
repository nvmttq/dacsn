const courses = require("../models/courseModel.js");
const groups = require("../models/groupModel.js");
const usertest = require("../models/userTestModel.js");
const GradesModel = require("../models/gradeModel.js");


class HomeController {
  index(req, res) {
    //console.log("session user in homeController", req.session.user);
    res.json({ msg: "HELLO INDEX HGOME" });
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
        idUser: req.body.username
      });
      if(grades) {
        res.json(grades);
      }
      else res.json({msg: "DONT MATCH ANY GRADES"});
    } catch (err) {
      res.json({ msg: "ERROR GRADES !!!" });
    }
  }
  // auth

  // async getUser(req, res) {
  //   if(req.session.user) {
  //     res.json(req.session.user);
  //   } else res.json({});
  // }
}

module.exports = new HomeController();
