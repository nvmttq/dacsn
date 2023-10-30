const MessageModel = require("../models/messageModel");

exports.getAll = (req, res) => {
    MessageModel.find()
        .then((data) => {
            res.status(200).json({
                data
            });
        })
        .catch((err) =>
            res.status(500).json({
                success: false,
            })
        );
};

exports.create = async (req, res) => {
    const { idMessage, idSender, idRecipient, content, dateSent } = req.body;
    const message = new MessageModel({
        idMessage: idMessage,
        idSender: idSender,
        idRecipient: idRecipient,
        content: content,
        dateSent: dateSent,
    });
    return message
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
exports.updateMessage = (req, res) => {
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