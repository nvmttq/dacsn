const CommentModel = require("../models/commentModel");

exports.getAll = (req, res) => {
  CommentModel.find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataComments: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.create = async (req, res) => {
  const { idPost, idUser, nameUser, imagePath, content, createDate, reply} = req.body;
  const comments = new CommentModel({
    idPost: idPost,
    idUser: idUser,
    nameUser: nameUser,
    imagePath: imagePath,
    content: content,
    createDate: createDate,
    reply: reply,
  });
  return comments
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created comment successfully",
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
exports.updateComment = (req, res) => {
  const { reply } = req.body;
  CommentModel.findByIdAndUpdate(req.body.id, {
    reply: reply,
  })
    .then(() => {
      return res.status(204).json({
        success: true,
        message: "Update comment successfully",
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