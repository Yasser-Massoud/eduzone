const express = require("express");
const path = require("path");
const db = require("./database/index.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const course = require("./routes/courses");
const file = require("./routes/upload");
const verify = require("./routes/verifyToken.js");
const app = express();
const port = process.env.PORT || 8080;
var server = app.listen(port, () => {
  console.log(`listening at port at http://localhost:${port}`);
});

var io = require("socket.io").listen(server);
const student = require("./routes/students");
const teacher = require("./routes/teachers");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config();
app.use(
  fileupload({
    useTempFiles: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(`../dist/eduzone`));

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname + "../../dist/eduzone/index.html"));
// });

app.use("/file", file);
app.use("/course", course);
app.use("/student", student);
app.use("/teacher", teacher);
// signaling for socket io
io.on("connection", function (socket) {
  // console.log('a user connected');

  socket.on("create or join", function (room) {
    console.log("create or join to room ", room);

    var myRoom = io.sockets.adapter.rooms[room] || { length: 0 };

    var numClients = myRoom.length;

    console.log(room, " has ", numClients, " clients");

    if (numClients == 0) {
      socket.join(room);
      socket.emit("created", room);
    } else if (numClients == 1) {
      socket.join(room);
      socket.emit("joined", room);
    } else {
      socket.emit("full", room);
    }
  });

  socket.on("ready", function (room) {
    socket.broadcast.to(room).emit("ready");
  });

  socket.on("candidate", function (event) {
    socket.broadcast.to(event.room).emit("candidate", event);
  });

  socket.on("offer", function (event) {
    socket.broadcast.to(event.room).emit("offer", event.sdp);
  });

  socket.on("answer", function (event) {
    socket.broadcast.to(event.room).emit("answer", event.sdp);
  });
});

// app.listen(port, () => {
//   console.log(`listening at port at http://localhost:${port}`);
// });
