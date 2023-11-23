const AttendanceModel = require("../models/attendanceModel");
const CourseModel = require("../models/courseModel");
const UserModel = require("../models/userModel.js");
const shortid = require("shortid");

exports.getAll = async (req, res) => {
  const { courseToken } = req.params;
  console.log(courseToken);
  await AttendanceModel.find({ courseToken })
    .then((docs) => {
      const returnData = docs.map(async (data) => {
        const repartUserStatus = data.userStatus.map(async (dataUS) => {
          const user = await UserModel.findOne({ username: dataUS.userID });

          return {
            user,
            status: dataUS.status,
          };
        });
        data.userStatus = await Promise.all(repartUserStatus).then((data) => {
          return data;
        });
        return data;
      });

      Promise.all(returnData).then((data) => {
        const selectedUsers = {};
        data.forEach((data) => {
          // console.log("AA",data)
          const select = [];
          data.userStatus.forEach((dataUS) => {
            if (dataUS.status) {
              select.push(dataUS);
            }
          });
          selectedUsers[data.token] = select;
        });
        res.status(200).json({
          success: true,
          attendances: data,
          selectedUsers,
        });
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.create = async (req, res) => {
  const { idCourse, listStudent } = req.body;
  console.log(listStudent);
  const atten = new AttendanceModel({
    idCourse: idCourse,
    listStudent: listStudent,
  });
  return atten
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created posts successfully",
        data: data,
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

exports.submitAttendance = async (req, res) => {
  const { selectedUsers, attendanceToken } = req.body;

  const attend = await AttendanceModel.findOne({ token: attendanceToken });
  // console.log(selectedUsers)
  const tmpUserStatus = attend.userStatus;
  attend.userStatus = [];
  let yes = 0,
    no = 0;
  tmpUserStatus.forEach((u) => {
    if (selectedUsers[attendanceToken].find((slu) => slu.user.username === u.userID)) {
      u.status = true;
      yes++;
    } else {
      u = {
        userID: u.userID,
        status: false,
      };
      no++;
    }
    attend.userStatus.push(u);
  });
  attend.yes = yes;
  attend.no = no;
  await attend.save().then(async (saved) => {
    console.log(saved);
    await AttendanceModel.find({ courseToken: saved.courseToken })
      .then((docs) => {
        const returnData = docs.map(async (data) => {
          const repartUserStatus = data.userStatus.map(async (dataUS) => {
            const user = await UserModel.findOne({ username: dataUS.userID });

            return {
              user,
              status: dataUS.status,
            };
          });

          data.userStatus = await Promise.all(repartUserStatus).then((data) => {
            return data;
          });
          return data;
        });

        Promise.all(returnData).then((data) => {
          const selectedUsers = {};
          data.forEach((data) => {
            // console.log("AA",data)
            const select = [];
            data.userStatus.forEach((dataUS) => {
              if (dataUS.status) {
                select.push(dataUS);
              }
            });
            selectedUsers[data.token] = select;
          });
          // console.log(selectedUsers)
          res.status(200).json({
            success: true,
            attendances: data,
            selectedUsers,
          });
        });
      })
      .catch((err) =>
        res.status(500).json({
          success: false,
        })
      );
  });
};

exports.createAttendance = async (req, res) => {
  const { courseToken } = req.body;

  const course = await CourseModel.findOne({ token: courseToken });

  const us = course.participants.map((p) => {
    return {
      userID: p.userID,
      status: true,
    };
  });

  const atten = new AttendanceModel({
    token: shortid.generate(),
    title: `Điểm danh khóa ${course.title}`,
    courseToken: courseToken,
    userStatus: us,
    yes: 0,
    no: 0,
    CreateAt: Date.now(),
  });

  await atten
    .save()
    .then(async (docs) => {
      const attends = await AttendanceModel.find({});
      return res.json({
        msg: "Ok create Attendance",
        data: attends,
      });
    })
    .catch((err) => {
      return res.json({
        msg: "Tạo attendance thất bại",
        data: err,
      });
    });
};
