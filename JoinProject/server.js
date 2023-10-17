require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const posts = require("./routes/posts");
const comments = require("./routes/comment");

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
route(app);
app.use(posts);
app.use(group)
app.use(comments);
app.use(course)
// CONNECT DATABASE
const connectDb = require("./db.js");
connectDb();


const MeetingSchema = require("./models/meetingModel.js");

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



const port = process.env.PORT || 3002;
server.listen(port, () => {
  console.log("SEVER RUNNING ON PORT", port);
});
