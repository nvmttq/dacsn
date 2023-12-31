require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");

const posts = require("./routes/posts");
const comments = require("./routes/comment");
const submitHistory = require("./routes/submitHistory");

const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: "http://localhost:3000",
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    key: "user_sid",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 },
  })
);

// ROUTES
const route = require("./routes/index.js");
const course = require("./routes/course.js");
const group = require("./routes/group.js");
const calendar = require("./routes/calendar");
const assignment = require("./routes/assignment.js");
const grade = require("./routes/grade.js");
const atten = require("./routes/attendance.js");
route(app);
app.use(atten);
app.use(grade);
app.use(assignment);
app.use(posts);
app.use(group);
app.use(comments);
app.use(course);
app.use(calendar);
app.use(submitHistory);
// CONNECT DATABASE
const connectDb = require("./db.js");
connectDb();

const MeetingSchema = require("./models/meetingModel.js");
const GroupModel = require("./models/groupModel.js");
const AssignmentModel = require("./models/assignmentModel.js");
const ExamModel = require("./models/examModel.js");
const CourseModel = require("./models/courseModel.js");
const AttendanceModel = require("./models/attendanceModel.js");


async function create() {
  const courses = await CourseModel.find({});
  courses.forEach(async (c) => {
    const us = c.participants.map(p => {
      return {
        userID: p.userID,
        status: 0,
        timeStart: Date.now(),
        timeEnd: Date.now(),
        grade: 0
      }
    })
    const exam = new ExamModel({
      id: `exam${c.token}`,
      name: "Trắc nghiệm chương 1 - Nhập xuất, toán tử logic",
      questions: [
        {
          id: "1",
          textQues: "C++ là ngôn ngữ lập trình nào?",
          choice: [
            {
              name: "A",
              textChoice: "C#",
              userChoose: [],
              
            },
            {
              name: "B",
              textChoice: "Java",
              userChoose: ["admin000"],
              
            },
            {
              name: "C",
              textChoice: "C++",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Python",
              userChoose: [],
              
            },
          ],
          answer: "C",
          gradeQues: 0,
          
        },
        {
          id: "2",
          textQues: "C++ được phát triển lần đầu bởi ai?",
          choice: [
            {
              name: "A",
              textChoice: "Bjarne Stroustrup",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "Dennis Ritchie",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Guido van Rossum",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Tim Berners-Lee",
              userChoose: [],
              
            },
          ],
          answer: "A",
          gradeQues: 0,
          
        },
        {
          id: "3",
          textQues: "C++ có hỗ trợ lập trình hướng đối tượng (OOP) không?",
          choice: [
            {
              name: "A",
              textChoice: "Có",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "Không",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Tùy tình huống",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Chưa rõ",
              userChoose: [],
              
            },
          ],
          answer: "A",
          gradeQues: 0,
          
        },
        {
          id: "4",
          textQues: "Trong C++, 'cout' được sử dụng để làm gì?",
          choice: [
            {
              name: "A",
              textChoice: "Nhập dữ liệu từ bàn phím",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "In dữ liệu ra màn hình",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Thực hiện phép tính toán",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Gửi email",
              userChoose: [],
              
            },
          ],
          answer: "B",
          gradeQues: 0,
          
        },
        {
          id: "5",
          textQues: "Câu lệnh 'if' dùng để làm gì trong C++?",
          choice: [
            {
              name: "A",
              textChoice: "Vòng lặp",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "So sánh chuỗi",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Kiểm tra điều kiện",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Chạy một hàm",
              userChoose: [],
              
            },
          ],
          answer: "C",
          gradeQues: 0,
          
        },
        {
          id: "6",
          textQues: "Dấu '++' trong C++ thể hiện điều gì?",
          choice: [
            {
              name: "A",
              textChoice: "Tăng giá trị của biến lên 1 đơn vị",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "Giảm giá trị của biến xuống 1 đơn vị",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Không có ý nghĩa gì",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Là toán tử cộng",
              userChoose: [],
              
            },
          ],
          answer: "A",
          gradeQues: 0,
          
        },
        {
          id: "7",
          textQues: "C++ có hỗ trợ đa kế thừa (multiple inheritance) không?",
          choice: [
            {
              name: "A",
              textChoice: "Có",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "Không",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Chỉ trong phiên bản C++11 trở lên",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Không rõ",
              userChoose: [],
              
            },
          ],
          answer: "A",
          gradeQues: 0,
          
        },
        {
          id: "8",
          textQues:
            "C++ là một ngôn ngữ tĩnh kiểu (statically-typed) hay động kiểu (dynamically-typed)?",
          choice: [
            {
              name: "A",
              textChoice: "Kiểu tĩnh (statically-typed)",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "Kiểu động (dynamically-typed)",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Tùy tình huống",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Không rõ",
              userChoose: [],
              
            },
          ],
          answer: "A",
          gradeQues: 0,
          
        },
        {
          id: "9",
          textQues:
            "Trong C++, 'new' và 'delete' được sử dụng cho mục đích gì?",
          choice: [
            {
              name: "A",
              textChoice: "Đọc và ghi file",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "Xử lý chuỗi",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Quản lý bộ nhớ động",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Làm việc với thời gian",
              userChoose: [],
              
            },
          ],
          answer: "C",
          gradeQues: 0,
          
        },
        {
          id: "10",
          textQues: "C++ hỗ trợ lập trình đa luồng (multithreading) không?",
          choice: [
            {
              name: "A",
              textChoice: "Có",
              userChoose: ["admin000"],
              
            },
            {
              name: "B",
              textChoice: "Không",
              userChoose: [],
              
            },
            {
              name: "C",
              textChoice: "Chỉ trong phiên bản C++11 trở lên",
              userChoose: [],
              
            },
            {
              name: "D",
              textChoice: "Không rõ",
              userChoose: [],
              
            },
          ],
          answer: "A",
          gradeQues: 0,
          
        },
      ],
      isReview: false,
      startAt: Date.now(),
      endAt: Date.now(),
      __v: 232,
      timelimit: 15,
      userStatus: us,
      courseToken: c.token,
      numberOfTimes: 982,
      percent: 60,
    });
    await exam.save();
  });
}


async function create_assignment() {
  const course = await CourseModel.findOne({
    token: "AmQEk1"
  });
  const groups = await GroupModel.find({courseToken: course.token});
  
  groups.forEach(async g => {
    const us = g.participants.map(p => {
      return p.userID;
    });

    const assign = await AssignmentModel.findOne({
      assignmentToken: "assToken2"
    })
    assign.userStatus.push({
      participants: us,
      assignmented: [],
      grade: 0,
      status: false
    });
    await assign.save();
  })
}

async function createAtten() {
  const courses = await CourseModel.find({});
  courses.forEach(async (c) => {
    const us = c.participants.map(p => {
      return {
        userID: p.userID,
        status: false
      }
    });
    const atten = AttendanceModel.find({courseToken: c.token});
    (await atten).forEach(async at => {
      at.userStatus = us;
      await at.save();
    })
      
  });
}
// createAtten();
// create_assignment();
// create();
io.on("connection", (socket) => {
  socket.on("join-room", async (data) => {
    const room = await MeetingSchema.findOne({ idMeeting: data.roomID });

    if (!room) {
      console.log("chua co");
      return;
    }

    console.log(socket.id);
    const isUserInRoom = room.participants
      .toObject()
      .find((user) => user.username === data.user.username);

    if (!isUserInRoom) {
      room.participants.push({
        socketID: socket.id,
        username: data.user.username,
        nameDisplay: data.user.name,
        isOnline: true,
      });
    } else {
      room.participants.forEach((user) => {
        if (user.username === data.user.username) {
          user.socketID = socket.id;
          user.isOnline = true;
        }
      });
    }
    await room.save();
    socket.join(data.roomID);

    const usersInThisRoom = room.participants
      .toObject()
      .filter((user) => user.socketID !== socket.id);
    // users[roomID].filter((id) => id !== socket.id);
    console.log(usersInThisRoom);
    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", async (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      nameDisplay: payload.nameDisplay,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
      nameDisplay: payload.nameDisplay,
    });
  });

  socket.on("get all message", async ({ roomID, userID }) => {
    const room = await MeetingSchema.findOne({ idMeeting: roomID });

    const conversation = room.conversation.toObject().map((m) => {
      return {
        conversation: m,
        isOwn: m.userID,
      };
    });

    socket.emit("get all message", conversation);
  });

  socket.on("send message", async (message) => {
    const room = await MeetingSchema.findOne({ idMeeting: message.roomID });

    if (room) {
      room.conversation.push({
        userID: message.userID,
        nameDisplay: message.nameDisplay,
        content: {
          file: message.file,
          text: message.text,
          emote: message.emote,
        },
      });

      await room.save();
      const sendMessage = {
        conversation: {
          userID: message.userID,
          nameDisplay: message.nameDisplay,
          content: {
            file: message.file,
            text: message.text,
            emote: message.emote,
          },
        },
        isOwn: message.userID,
      };
      // console.log(sendMessage)
      io.emit("return message", sendMessage);
    }
  });

  socket.on("disconnect", async () => {
    console.log("USER LEFT1");
    socket.broadcast.emit("user left", socket.id);
    const userLeft = await MeetingSchema.find({
      "participants.socketId": socket.id,
    });
    if (!userLeft) return;
    await MeetingSchema.updateOne(
      { "participants.socketId": socket.id },
      {
        $pull: {
          participants: { socketId: socket.id },
        },
      }
    );
  });
});

io.of("/group").on("connection", (socket) => {
  socket.on("send message", async ({ message, user, socketID, groupToken }) => {
    const group = await GroupModel.findOne({ token: groupToken });

    if (group) {
      group.conversations.push({
        userID: user.username,
        nameDisplay: user.name,
        content: message,
      });

      await group.save();

      const sendMessage = {
        conversation: {
          userID: user.username,
          nameDisplay: user.name,
          content: message,
        },
        isOwn: user.username,
      };

      io.of("/group").emit("abc", group.conversations);
    }
  });
});

const port = process.env.PORT || 3002;
server.listen(port, () => {
  console.log("SEVER RUNNING ON PORT", port);
});
