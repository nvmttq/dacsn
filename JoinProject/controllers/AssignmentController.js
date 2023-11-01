const GroupModel = require("../models/groupModel.js");
const UserModel = require("../models/userModel.js");
const AssignmentModel = require("../models/assignmentModel.js");
const shortid = require("shortid");

module.exports = {
  submitAssignment: async (req, res) => {
    const { files, group, assignment } = req.body;
    const participants = group.participants;
    const ass = await AssignmentModel.findOne({
      assignmentToken: assignment.assignmentToken,
    });

    const checkExist = ass.userStatus.find((data) =>
      data.participants.find((p) => p === participants[0].userID)
    );

    if (checkExist) {
      ass.userStatus.forEach((data) => {
        if (data.participants.find((p) => p === participants[0].userID)) {
          data.status = true;
          files.forEach((f) => {
            data.assignmented.push({
              name: f.name,
              size: f.size,
              uploadDate: Date.now(),
            });
          });
        }
      });

      await ass.save();
    } else {
      const convertParticipants = participants.map((p) => p.userID);

      ass.userStatus.push({
        participants: convertParticipants,
        assignmented: files,
        status: true,
      });
      await ass.save();
    }
    return res.json({
      code: 200,
      msg: "Nop bai tap nhom thanh cong",
      assignment: ass
    });
  },

};
