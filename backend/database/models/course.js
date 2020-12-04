const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// schema for courses
const Course = new Schema(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "teacher",
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    numberOfViews: {
      type: Number,
      required: false,
      default: 0,
    },
    rating: {
      type: Number,
      required: false,
    },
    sections: {
      type: String,
      required: true,
    },
    comments: [
      {
        author: {
          type: String,
          required: false,
        },
        text: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", Course);
