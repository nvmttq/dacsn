require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const posts = require("./routes/posts");

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
app.use(posts);

// ROUTES
const route = require("./routes/index.js");
route(app);

// CONNECT DATABASE
const connectDb = require("./db.js");
connectDb();

const users = {};
const socketToRoom = {};

const MeetingSchema = require("./models/meetingModel.js");

io.on("connection", (socket) => {
  socket.on("join-room", async (data) => {
    const room = await MeetingSchema.findOne({ idMeeting: data.roomID });

    if (!room) {
      console.log("chua co");
      return;
    }
  
    console.log(socket.id);
    const isUserInRoom = room.participants.toObject().find((user) => user.username === data.user.username);

    if(!isUserInRoom) {
      room.participants.push({
        socketId: socket.id,
        username: data.user.username,
        nameDisplay: data.user.name,
        isOnline: true
      })
    } else {
      room.participants.forEach(user => {
        if(user.username === data.user.username) {
          user.socketId = socket.id;
          user.isOnline = true
        }
      })
    }
    await room.save();
    socket.join(data.roomID);

    const usersInThisRoom = room.participants
      .toObject()
      .filter((user) => user.socketId !== socket.id);
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
  socket.on("disconnect", async () => {
    console.log("USER LEFT1");
    socket.broadcast.emit("user left", socket.id);
    const userLeft = await MeetingSchema.find({"participants.socketId" : socket.id});
    if(!userLeft) return;
    await MeetingSchema.updateOne({"participants.socketId" : socket.id}, {
      $pull: {
        "participants": {socketId: socket.id}
      }
    });
  });
});

const port = process.env.PORT || 3002;
server.listen(port, () => {
  console.log("SEVER RUNNING ON PORT", port);
});
