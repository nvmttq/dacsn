const courses = require("../models/courseModel.js");
const CourseModel = require("../models/courseModel.js");
const GroupModel = require("../models/groupModel.js");
const usertest = require("../models/userModel.js");
const GradesModel = require("../models/gradeModel.js");
const ExamModel = require("../models/examModel.js");
const ContentSubjectModel = require("../models/contentSubjectModel.js");
const DkmhModel = require("../models/dkmhModel.js");
const userModel = require("../models/userModel.js");

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
      const listCourse = await courses.find({});
      listCourse.forEach((course) => {
        // console.log("DATA TOEKN ", data, user.courses);
        if(req.query.yearFrom) {
          const {yearFrom, yearTo, hk} = req.query;
          console.log(yearFrom, yearTo, hk)
          if(course.yearFrom !== yearFrom || course.yearTo!== yearTo || course.hk!== hk) {
            return;
          }
        }
        if (user.courses.includes(course.token)) {
          coursesOfUser.push(course);
        }
      });
      res.json(coursesOfUser);
    } catch (err) {
      res.json({ msg: err });
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
      const { user } = req.body;
      await GroupModel.find({}).then((groups) => {
        let username = user.username;
        groups.forEach((group) => {
          if (group.participants.find((user) => user.userID === username)) {
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

  async startExam(req, res) {
    const { user, examToken } = req.body;
    try {
      // 0 chua bat dau, 1 pending, 2 ok
      const exam = await ExamModel.findOne({ id: examToken });
      exam.questions.forEach((ques) => {
        ques.choice.forEach((c) => {
          c.userChoose = [];
        });
      });
      exam.userStatus.forEach((u) => {
        if (u.userID === user.username) {
          u.status = 1;
          u.timeStart = new Date();
          u.timeEnd = new Date();
        }
      });
      exam.numberOfTimes -= 1;
      await exam.save();

      return res.json({
        severity: "success",
        msg: "Cập nhật thành công!",
        exam,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        severity: "error",
        msg: "Cập nhật không thành công!",
        err,
      });
    }
  }

  async submitExam(req, res) {
    const { user, examToken } = req.body;
    try {
      const exam = await ExamModel.findOne({ id: examToken });

      var correct = 0,
        wrong = 0;
      exam.questions.forEach((ques) => {
        ques.choice.forEach((c) => {
          if (c.name.toUpperCase() === ques.answer.toUpperCase()) {
            if (c.userChoose.find((u) => u === user.username)) correct++;
            else wrong++;
          }
        });
      });

      exam.userStatus.forEach((u) => {
        if (u.userID === user.username) {
          u.status = 2;
          u.timeEnd = new Date();
          u.grade = correct;
        }
      });
      await exam.save();

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

  async editExam(req, res) {
    const { examToken, exam } = req.body;

    const examCurrent = await ExamModel.findOne({ id: examToken });
    examCurrent.questions = exam.questions;
    examCurrent.timelimit = exam.timelimit;
    examCurrent.name = exam.name;
    examCurrent.percent = exam.percent;
    await examCurrent.save();
    return res.json({
      severity: "success",
      msg: "Cập nhật thành công",
      exam,
    });
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
          // console.log(docs);
          const contentSubject = await ContentSubjectModel.findOne({
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

  async getAllUser(req, res) {
    const users = await userModel.find({});
    return res.json(users);
  }

  async getUser(req, res) {
    const { participants } = req.body;

    const users = await userModel.find({});
    const ret = users
      .filter((u) => participants.find((userID) => userID === u.username))
      .map((data) => {
        return {
          username: data.username,
          nameDisplay: data.name,
          role: data.role,
        };
      });
    return res.json(ret);
  }

  async saveContentCourse(req, res) {
    const { username, courseInformation, name } = req.body;
    const user = await userModel.findOne({ username });

    const checkExistLND = user.repositories.find((store) => store.id === "LND");
    if (!checkExistLND) {
      user.repositories.push({
        id: "LND",
        name: "Nội dung khóa học",
        data: [],
        createAt: Date.now()
      });
    }
    user.repositories.find((store) => {
      if (store.id === "LND") {
        store.data.push({
          title: (name ? name : courseInformation.title),
          courseToken: courseInformation.token,
          contentCourse: courseInformation.contentCourse,
          createAt: Date.now()
        });
      }
    });

    await user.save();

    return res.json({
      user,
      code: 200,
      msg: "Luu noi dung khoa hoc thanh cong",
    });
  }

  async getRepository (req, res) {
    const { user } = req.body;

    const a = await userModel
      .findOne({ username: user.username })
    
      if(a) {
        console.log(a)
        res.json({
          msg: "Get repositoty thanh cong",
          code: 200,
          data: a,
        });
      }
    res.json({
      msg: "Khong tim thay nguoi dung trong csdl",
      code: 404,
    });
  }
}

module.exports = new HomeController();
