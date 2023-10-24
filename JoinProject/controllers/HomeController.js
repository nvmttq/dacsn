const courses = require("../models/courseModel.js");
const CourseModel = require("../models/courseModel.js");
const GroupModel = require("../models/groupModel.js");
const usertest = require("../models/userModel.js");
const GradesModel = require("../models/gradeModel.js");
const ExamModel = require("../models/examModel.js");
const ContentSubjectModel = require("../models/contentSubjectModel.js");
const DkmhModel = require("../models/dkmhModel.js");

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
          user.courses.push(req.body.courseToken);
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
      // let user = await usertest.findOne({ username: req.params.username });
      // user = user.toObject();
      let groupsOfUser = [];
      // const gg = await groups.find({});
      // gg.forEach((data) => {
      //   if (user.groups.includes(data.id)) {
      //     groupsOfUser.push(data);
      //   }
      // });
      await GroupModel.find({}).then((groups) => {
        let username = req.params.username;
        groups.forEach((group) => {
          if (
            group.participants.find((user) => user.userID === username)
          ) {
            groupsOfUser.push(group);
          }
        });
      });
      res.json(groupsOfUser);

    } catch (err) {
      res.json({ msg: "err group" });
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
      const exam = await ExamModel.findOne({ id: examToken });
      let totalCorrect = 0;
      exam.questions.forEach((e) => {
        e.choice.forEach((c) => {
          c.userChoose.forEach((username) => {
            if (c.name === e.answer && req.body.username === username)
              totalCorrect++;
          });
        });
      });
      res.json({
        exam,
        totalCorrect,
      });
    } catch (err) {
      console.log(err);
      res.json({ msg: err });
    }
  }

  async getExamForUserInCourse(req, res) {
    try {
      const examToken = req.params.examToken;

      const exam = await ExamModel.findOne({ id: examToken });

      return res.json(exam);
    } catch (err) {
      return res.json(err);
    }
  }

  async setChoice(req, res) {
    const { user, quesID, choiceName, examToken } = req.body;

    const exam = await ExamModel.findOne({ id: examToken });
    exam.questions.forEach((ques) => {
      if (ques.id === quesID) {
        ques.choice.forEach((c) => {
          const isUserChoose = c.userChoose.find(
            (username) => username === user.username
          );
          if (isUserChoose) {
            c.userChoose = c.userChoose.filter(
              (username) => username !== user.username
            );
          }
          if (c.name === choiceName) {
            c.userChoose.push(user.username);
          }
        });
      }
    });
    await exam.save();

    return res.json({
      msg: "change chocie",
      data: exam,
    });
  }

  async submitExam(req, res) {
    const { user, examToken } = req.body;
    try {
      const exam = await ExamModel.findOne({ id: examToken });
      exam.userStatus.forEach((u) => {
        if (u.userID === user.username) {
          u.status = true;
        }
      });
      await exam.save();

      var correct = 0,
        wrong = 0;
      exam.questions.forEach((ques) => {
        ques.choice.forEach((c) => {
          c.userChoose.forEach((u) => {
            if (
              c.name.toUpperCase() === ques.answer.toUpperCase() &&
              u === user.username
            ) {
              correct++;
            } else wrong++;
          });
        });
      });
      console.log(correct, wrong);
      const grade = new GradesModel({
        id: "gradetest",
        name: exam.name,
        courseToken: exam.courseToken,
        examToken: exam.id,
        status: "Đã hoàn thành",
        grade: correct,
        percent: 20,
        userID: user.username,
      });
      await grade.save();
      return res.json({
        severity: "success",
        msg: "Nộp bài thành công !",
        grade,
        exam,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        severity: "error",
        msg: "Nộp bài không thành công công !",
        err,
      });
    }
  }

  async getContentCourse(req, res) {
    const { user, courseID } = req.body;

    // try {
    //   const contentSubject = await ContentSubjectModel.findOne({courseID: courseToken})
    // }
  }

  async loadDkmh(req, res) {
    try {
      await DkmhModel.find({}).then((documents) => {
        documents.forEach(async (docs) => {
          console.log(docs);
          const contentSubject = await ContentSubjectModel.find({
            id: docs.contentSubjectID,
          });

          const course = new CourseModel({
            id: "test",
            title: docs.courseFullName,
            token: docs.courseID,
            assignment: 0,
            participants: docs.participants.map((user, i) => {
              return {
                userID: user.userID,
                nameDisplay: user.fullName,
                isTeacher: user.role === "GV",
                isTeachingAssitant: user.role === "TA",
              };
            }),
            contentCourse: contentSubject.contentCourse,
          });

          docs.participants.forEach(async (user) => {
            await usertest.findOneAndUpdate(
              { username: user.userID },
              {
                $push: {
                  courses: docs.courseID,
                },
              }
            );
          });

          const saveCourse = await course
            .save()
            .catch((err) => console.log(err));
        });
      });

      return res.json({
        msg: "Đã load danh sách thành công",
        code: 200,
      });
    } catch (err) {
      return res.json({
        msg: "Có gì đó sai sai khi load danh sách đăng ký môn học" + "\n" + err,
        code: 500,
      });
    }
  }
}

module.exports = new HomeController();
