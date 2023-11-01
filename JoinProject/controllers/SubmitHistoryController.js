const submitHistoryModel = require("../models/submitHistoryModel");

exports.getAll = (req, res) => {
  submitHistoryModel
    .find()
    .then((data) => {
      res.status(200).json({
        success: true,
        dataSubmitHistory: data,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
      })
    );
};

exports.create = async (req, res) => {
  const { idUser, idExam, lastSubmit, point, correctAnswer, numberOfCorrect, exam } = req.body;
  const submitHistory = new submitHistoryModel({
    idUser: idUser,
    idExam: idExam,
    lastSubmit: lastSubmit,
    point: point,
    correctAnswer: correctAnswer,
    numberOfCorrect: numberOfCorrect,
    exam: exam,
  });
  return submitHistory
    .save()
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "Created submit history successfully",
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
