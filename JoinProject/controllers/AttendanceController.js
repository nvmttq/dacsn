const AttendanceModel = require("../models/attendanceModel");
const CourseModel = require("../models/courseModel")

exports.getAll = (req, res) => {
    AttendanceModel.find()
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

exports.getAllCourse = (req, res) => {
    CourseModel.find()
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
    const { idCourse, listStudent } = req.body;
    console.log(listStudent);
    const atten = new AttendanceModel({
        idCourse: idCourse,
        listStudent: listStudent,
    });
    return atten
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