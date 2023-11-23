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
exports.updateContent = async (req, res) => {
  const { token, contentCourse } = req.body;
  await CourseModel.findOneAndUpdate(
    { token: token },
    { contentCourse: contentCourse }
  )
    .then((docs) => {
      return res.json({
        status: 204,
        success: true,
        message: "Update content successfully",
        courseUpdate: docs,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: 500,
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
};

exports.divGroup = async (req, res) => {
  const { courseToken, numberStudentOfGroup } = req.body;

  const course = await CourseModel.findOne({ token: courseToken });
  const participants = course.participants;
  const groupsStudents = {};
  var id = 1;
  while (participants.length) {
    groupsStudents[id++] = participants.splice(0, numberStudentOfGroup);
    console.log(numberStudentOfGroup);
    const group = groupsStudents[id - 1];
    const newGroup = new GroupModel({
      id: "test",
      courseToken,
      token: shortid.generate(),
      title: `Nhóm ${id - 1} - ${course.title}`,
      participants: group.map((g, i) => {
        return {
          userID: g.userID,
          nameDisplay: g.nameDisplay,
        };
      }),
    });
    newGroup
      .save()
      .then((res) => console.log("DONE DIV GROUP"))
      .catch((err) => console.log(err));
  }

  return res.json({
    code: 200,
    groupsStudents,
  });
};

exports.getUsers = async (req, res) => {
  const { courseToken } = req.body;

  const course = await CourseModel.findOne({ token: courseToken });
  const participants = course.participants;

  return res.json({
    code: 200,
    participants,
  });
};

const solveSort = (sortField, sortOrder, participants) => {
  if(sortField === "fullName") return participants.sort((a, b) => a.nameDisplay > b.nameDisplay ? sortOrder : sortOrder*-1);

  if(sortField === "mssv") return participants.sort((a, b) => a.userID > b.userID ? sortOrder : sortOrder*-1);

  if(sortField === "group") return participants.sort((a, b) => a.nameDisplay > b.nameDisplay ? sortOrder : sortOrder*-1);

  if(sortField === "email") return participants.sort((a, b) => a.nameDisplay > b.nameDisplay ? sortOrder : sortOrder*-1);

  if(sortField === "role") return participants.sort((a, b) => a.nameDisplay > b.nameDisplay ? sortOrder : sortOrder*-1);
  return participants;
}

const solveFilters = (fullName, mssv, group, role, email, participants) => {
  console.log(fullName["value"])
  if(fullName["value"] === "") {
    return participants;
  }
  return participants.filter(p => {

    const ck =(p.nameDisplay.indexOf(fullName["value"]))
    return ck > -1
  });
}
exports.getParticipants = async (req, res) => {
  const {lazyEvent} = req.query;
  const { first, rows, page, sortField, sortOrder, filters, courseToken } =
    JSON.parse(lazyEvent);
  
  const {fullName, mssv, group, role, email} = filters;
  const course = await CourseModel.findOne({token: courseToken});
  const participants = course.participants;
  const pcSort = solveSort(sortField, sortOrder, participants);
  const pcFilter = solveFilters(fullName, mssv, group, role, email, pcSort);
  const totalRecords = pcFilter.length;
  const participantsOnPage = {}; 
  var id = 1;
  while (pcFilter.length) {
    participantsOnPage[id++] = pcFilter.splice(0, rows);
  }
  // console.log(participantsOnPage[page])
  res.json({
    totalRecords,
    pp:participantsOnPage[page + 1],
    participantsOnPage,
    page: page+1
  })

  // const course
};
