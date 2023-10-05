const courses = require("../models/courseModel.js");
const groups = require("../models/groupModel.js");
const usertest = require("../models/userModel.js");

class AuthController {

  // auth
  async login(req, res) {
    try {
      const user = await usertest.findOne({
        username: req.body.username,
        password: req.body.password
      });
      if(user) {
       // console.log(user)
        res.json(user);
      }
      else res.json({msg: "DONT MATCH"});
    } catch (err) {
      res.json({ msg: "DONT MATCH ANY !!!" });
    }
  }

 
}

module.exports = new AuthController();
