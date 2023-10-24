const CourseModel = require("../models/courseModel.js");
const UserModel = require("../models/userModel.js");
const GroupModel = require("../models/groupModel.js");
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

exports.divGroup = async (req, res) => {
  const { courseToken, numberStudentOfGroup} = req.body;
  
  const course = await CourseModel.findOne({token: courseToken})
  const participants = course.participants;
  const groupsStudents = {};
  var id = 1;
  while(participants.length) {
    groupsStudents[id++] = participants.splice(0,numberStudentOfGroup);
    console.log(numberStudentOfGroup)
    const group = groupsStudents[id-1];
    const newGroup = new GroupModel({
      id: "test",
      courseToken,
      token: shortid.generate(),
      title: `Nhóm ${id-1} - ${course.title}`,
      participants: group.map((g,i) => {
        return {
          userID: g.userID,
          nameDisplay: g.nameDisplay,
        };
      })
    });
    newGroup.save().then(res => console.log("DONE DIV GROUP")).catch(err => console.log(err));  
  }
  // const groupSchema = new mongoose.Schema({
  //   id: { type: String, required: false },
  //   title: { type: String, required: false },
  //   courseToken: {type: String, default: ""},
  //   token: { type: String, default: "" },
  //   participants: [{
  //     userID: { type: String, default: ""},
  //     nameDisplay: {type: String, default: ""},
  //     isCreator: {type: Boolean, default: false}
  //   }];


    


  return res.json({
    code: 200,
    groupsStudents
  })
};


exports.getUsers = async (req, res) => {
  const { courseToken } = req.body;
  
  const course = await CourseModel.findOne({token: courseToken})
  const participants = course.participants;
  
  return res.json({
    code: 200,
    participants
  })
}