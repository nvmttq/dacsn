const courses = require("../models/courseModel.js");
const groups = require("../models/groupModel.js");
const usertest = require("../models/userTestModel.js");

class HomeController {
  index(req, res) {
    //console.log("session user in homeController", req.session.user);
    res.json({ msg: "HELLO INDEX HGOME" });
  }
  news(req, res) {
    res.redirect("/news");
  }
  async getCourse(req, res) {
    const course = await courses.findOne({ token: req.params.courseToken });
    if (course === null) res.json({ msg: "DON't COURSE MATCH TOKEN" });
    else res.json(course);
  }

  async getAllCourse(req, res) {
    try {
      const allCourse = await courses.find({});
      res.json(allCourse);
    } catch (err) {
      res.json({ msg: "DONT MATCH ANY !!!" });
    }
  }

  async getCourseWithUserName(req, res) {
    try {
      const user = usertest.findOne({username: req.params.username});
      
      const course = await courses.find({ token: req.params.courseToken });
      if (course === null) res.json({ msg: "DON't COURSE MATCH TOKEN" });
      else res.json(course);
    } catch (err) {
      res.json({msg: "dont have"})
    }
  }

  async getAllGroup(req, res) {
    try {
        const allGroup = await groups.find({});
        res.json(allGroup);
      } catch (err) {
        res.json({ msg: "DONT MATCH ANY !!!" });
      }
  }

  async login(req, res) {
    try {
      const user = await usertest.findOne({
        username: req.body.username,
        password: req.body.password
      });
      if(user) res.json(user);
      else res.json({msg: "DONT MATCH"});
    } catch (err) {
      res.json({ msg: "DONT MATCH ANY !!!" });
    }
  }
}

module.exports = new HomeController();
