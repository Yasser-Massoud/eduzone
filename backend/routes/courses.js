const router = require("express").Router();
const Course = require("../database/models/course");

//get one course

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const course = await Course.findById(req.params.id)
    .populate("teacher")
    .exec();
  res.json(course);
});

//get all courses

router.get("/", async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

router.post("/getCourses", async (req, res) => {
  const courses = await Course.find({ teacher: req.body.teacherId })
    .populate("teacher")
    .exec();
  res.json(courses);
});

// router.get("/getBySection/:section", async (req, res) => {
//   const sections = req.params.section;
//   if(sections){
//     const courses = await Course.find({ sections })
//     res.json(courses)
//   }else{
//     return res.status(401).json({});
//   }

// });

// console.log(req.params);
// const courses = await Course.find({ category: req.body.teacherId })
//   .populate("teacher")
//   .exec();
// console.log(courses);
// res.json(courses);

// add new couses in the database
router.post("/addCourse", async (req, res) => {
  const {
    teacher,
    title,
    description,
    videoUrl,
    imgUrl,
    price,
    numberOfViews,
    rating,
    sections,
    comments,
  } = req.body;

  const newCourse = new Course({
    teacher,
    title,
    description,
    videoUrl,
    imgUrl,
    price,
    numberOfViews,
    rating,
    sections,
    comments,
  });

  const newCourseAdded = await newCourse.save();
  console.log("cours", newCourseAdded);

  res.send(newCourseAdded);
});

router.put("/:id", async (req, res) => {
  console.log(req.body);
  const course = await Course.findByIdAndUpdate(req.params.id, req.body);
  res.json(course);
});

router.put("/rating/:id", async (req, res) => {
  console.log(req.body);
  const cours = await Course.findById(req.params.id);
  let average = (cours.rating + req.body.rating) / 2;
  let newAverage = average.toFixed(2);
  await Course.findByIdAndUpdate(req.params.id, { rating: newAverage });
  res.json("course updated");
});

module.exports = router;
