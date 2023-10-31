const mongoose = require("mongoose");


const CalendarSchema = new mongoose.Schema({
    id: { type: String, default: "" },
    title: { type: String, default: "" },
    start: { type: String },
    end: { type: String },
});
// {
//     "_id": {
//       "$oid": "653fd4de9f7a2668438072c6"
//     },
//     "end": {
//       "$date": "2023-10-31T05:30:00.000Z"
//     },
//     "id": "1",
//     "start": {
//       "$date": "2023-10-30T00:00:00.000Z"
//     },
//     "title": "Đồ án cơ sở ngành"
//   }
module.exports = mongoose.model("calendar", CalendarSchema);
