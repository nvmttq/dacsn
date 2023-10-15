const CourseModel = require("../models/groupModel.js");
const UserModel = require("../models/userModel.js");
const shortid = require('shortid');

module.exports = {
  CreateCourse: async (req, res) => {
    const { nameGroup, user } = req.body;

    try {
      const groupToken = shortid.generate();
      const group = new GroupModel({
        token: groupToken,
        title: nameGroup,
        // participants: [{ userID: user.username, nameDisplay: user.name, isTeacher: (user.role === "GV" || user.role === "GIẢNG VIÊN"), isTeachingAssitant: (user.role === "TA" || user.rolen === "TRỢ GIẢNG") }]
      });

      const saveCourse = await group.save();
      await UserModel.findOneAndUpdate({ username: user.username }, {
        $push: {
          groups: groupToken
        }
      });

      res.json({
        severity: "success",
        msg: `Tạo khóa học thành công`,
      });
    } catch (err) {
      res.json({
        severity: "error",
        msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !"
      });
    }
  },
};
