const PostsModel = require("../models/postModel");

exports.getAll = (req, res) => {
  PostsModel.find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataPosts: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.create = async (req, res) => {
  const { title, content } = req.body;
  const posts = new PostsModel({
    title: title,
    content: content,
  });
  return posts
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
