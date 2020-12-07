const router = require("express").Router();
const Student = require("../database/models/student");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken.js");
const dotenv = require("dotenv");

dotenv.config();

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
});

const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

dotenv.config();

//get student by Id
router.get("/:id", async (req, res) => {
  const student =await Student.findById(req.params.id);
  res.json(student);
});
//getting all students
router.get("/", async (req, res) => {
  await Student.find({}, (err, data) => {
    res.json(data);
  });
});

//validation for registration of a student
const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.number(),
  dateOfBirth: Joi.date(),
  imageUrl: Joi.string(),
});
// //send request to join a video chat room via email
router.post("/sendRequestVideo", async (req,res)=>{
  nodemailer.createTestAccount((err, email) => {
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        port: 465,
        secure: false,
        host: "smtp.gmail.com",
        auth: {
          user: "Eduzone.Tunisia@gmail.com",
          pass: "eduzone12112020",
        },
        tls: {
          rejectUnauthorized: false,
        },
      })
    );

    let mailOptions = {
      from: "Eduzone.Tunisia@gmail.com",
      to: `${req.body.email}`,
      subject: "Request to join a video confrence ",
      text: `
        welcome ${req.body.lastName} ${req.body.firstName},
        
                There's a video conference request please join on room ${req.body.roomNumber}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      }
    });
  });
  
})
//create a student
router.post("/studentRegistration", async (req, res, next) => {
  console.log(req.body);
  //check if student exists
  const emailExist = await Student.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email already exists");
  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newStudent = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      imageUrl: req.body.imageUrl,
    });
    ///send mail to student after sign up
    nodemailer.createTestAccount((err, email) => {
      var transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          port: 465,
          secure: false,
          host: "smtp.gmail.com",
          auth: {
            user: "Eduzone.Tunisia@gmail.com",
            pass: "eduzone12112020",
          },
          tls: {
            rejectUnauthorized: false,
          },
        })
      );

      let mailOptions = {
        from: "Eduzone.Tunisia@gmail.com",
        to: `${req.body.email}`,
        subject: "eduZone Application",
        text: `
          welcome ${req.body.lastName} ${req.body.firstName},
          
                    Congratulation! you've successfuliy signed up for eduZone.
                    Now it's time to access your account so you can start dowloading your courses online.
                    
                    -Sign in to your account at : http://localhost:8080/login
                    -Access to your account.
                    -dowload your courses on video format.
                    -Check your purchases.
                    - comment,rate and ask questions to teacher.
          
                    We're delighted to welcome you to eduZone.
                    
                    See you online.
                    The eduZone team.`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        }
      });
    });

    const { error } = await schema.validateAsync(req.body);
    const savedStudent = await newStudent.save();
    res.send(savedStudent);
  } catch (error) {
    if (error.isJoi === true) res.status(400).send(error.details[0].message);
    next(error);
  }
});

//validation for student login

const loginschema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

// login for student
router.post("/login", async (req, res, next) => {
  console.log(req.body);
  //check if student already exist
  try {
    const { error } = await loginschema.validateAsync(req.body);
    const student = await Student.findOne({ email: req.body.email });
    if (!student) return res.status(400).send("Email or password is wrong");

    //check password
    const validPass = await bcrypt.compare(req.body.password, student.password);
    if (!validPass) return res.status(400).send("password not valid");

    //create and assign a token
    console.log(process.env.SECRET_TOKEN);
    const token = jwt.sign({ _id: student._id }, "123456789");
    res.header("auth-token", token).send({ token: token, id: student.id });
  } catch (error) {
    if (error.isJoi === true) res.status(400).send(error.details[0].message);
    next(error);
  }
});

//update a student
router.put("/:id", async (req, res) => {
  console.log(req.body);
  //check if email exists
  const emailExist = await Student.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email already exists");
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newInfo = {
    email: req.body.email,
    password: hashedPassword,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    videos: req.body.videos,
  };
  // still joi validation for the update form
  //  const {error}  = await updateValidation.validateAsync(req.body)

  const updatedInfo = await Student.findByIdAndUpdate(req.params.id, newInfo);
  console.log(updatedInfo);
  res.send(updatedInfo);
});

router.put("/likeCourse/:id", async (req, res) => {
  const updatedst = {
    videos: req.body.videos,
  };
  await Student.findByIdAndUpdate(req.params.id, updatedst);
  res.json("student  updated");
});

module.exports = router;
