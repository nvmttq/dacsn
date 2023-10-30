const mongoose = require("mongoose");


const CalenderSchema = new mongoose.Schema({
    id: { type: String, default: "" },
    title: { type: String, default: "" },
    start: { type: String },
    end: { type: String },
});

module.exports = mongoose.model("calender", CalenderSchema);
