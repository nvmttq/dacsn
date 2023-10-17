const mongoose = require("mongoose");


const childContentSubjectSchema = new mongoose.Schema({
    key: { type: String },
    label: { type: String },
    data: { type: String, default: "" },
    icon: { type: String, default: "" },
    children: { type: Array, default: [] },
});

module.exports = mongoose.model("childcontentSubject", childContentSubjectSchema);
