const CourseModel = require("../models/courseModel.js");
const UserModel = require("../models/userModel.js");
const shortid = require("shortid");

exports.getAll = (req, res) => {
  CourseModel.find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataCourse: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.CreateCourse = async (req, res) => {
  const { nameCourse, user } = req.body;

  try {
    const courseToken = shortid.generate();
    const course = new CourseModel({
      token: courseToken,
      assignment: 0,
      title: nameCourse,
      participants: [
        {
          userID: user.username,
          nameDisplay: user.name,
          isTeacher: user.role === "GV" || user.role === "GIẢNG VIÊN",
          isTeachingAssitant: user.role === "TA" || user.rolen === "TRỢ GIẢNG",
        },
      ],
    });

    const saveCourse = await course.save();
    await UserModel.findOneAndUpdate(
      { username: user.username },
      {
        $push: {
          courses: courseToken,
        },
      }
    );

    res.json({
      severity: "success",
      msg: `Tạo khóa học thành công`,
    });
  } catch (err) {
    res.json({
      severity: "error",
      msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !",
    });
  }
};
exports.updateContent = (req, res) => {
  const { token, contentCourse } = req.body;
  CourseModel.findOneAndUpdate(
    { token: token },
    { contentCourse: contentCourse }
  )
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update content successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};
