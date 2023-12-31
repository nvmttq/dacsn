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
  const {
    title,
    content,
    author,
    nameAuthor,
    notification,
    createDate,
    listUnseenUser,
    idCourse,
  } = req.body;
  const posts = new PostsModel({
    title: title,
    content: content,
    author: author,
    nameAuthor: nameAuthor,
    notification: notification,
    createDate: createDate,
    listUnseenUser: listUnseenUser,
    idCourse: idCourse,
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
exports.updatePosts = (req, res) => {
  const { like } = req.body;
  PostsModel.findByIdAndUpdate(req.body.id, {
    like: like,
  })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update like successfully",
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
exports.editPost = (req, res) => {
  // console.log(req.body);
  PostsModel.findByIdAndUpdate(req.body._id, {
    title: req.body.title,
    content: req.body.content,
  })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update like successfully",
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

exports.deletePost = (req, res) => {
  PostsModel.findByIdAndDelete(req.body._id, {})
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update like successfully",
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

exports.updateNotification = (req, res) => {
  const { listUnseenUser } = req.body;
  PostsModel.findByIdAndUpdate(req.body.id, { listUnseenUser: listUnseenUser })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update notification successfully",
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
exports.updateBlockComment = (req, res) => {
  const { isBlockComment } = req.body;
  PostsModel.findByIdAndUpdate(req.body.id, { isBlockComment: isBlockComment })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update block comment successfully",
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