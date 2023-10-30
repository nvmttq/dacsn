const CalendarModel = require("../models/calendarModel");

exports.getAll = (req, res) => {
    CalendarModel.find()
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
    const { id, title, start, end } = req.body;
    const calendar = new CalendarModel({
        id: id,
        title: title,
        start: start,
        end: end,
    });
    return calendar
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
