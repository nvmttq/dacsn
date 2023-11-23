const GroupModel = require("../models/groupModel.js");
const UserModel = require("../models/userModel.js");
const AssignmentModel = require("../models/assignmentModel.js");
const shortid = require("shortid");

module.exports = {
  CreateGroup: async (req, res) => {
    const { nameGroup, user } = req.body;
    try {
      const groupToken = shortid.generate();
      const group = new GroupModel({
        token: groupToken,
        title: nameGroup,
        participants: [{ idUser: user.username, isCreator: true }],
      });

      const saveGroup = await group.save();
      await UserModel.findOneAndUpdate(
        { username: user.username },
        {
          $push: {
            groups: groupToken,
          },
        }
      );
      console.log(group);
      res.json({
        severity: "success",
        msg: `Tạo khóa học thành công`,
      });
    } catch (err) {
      res.json({
        severity: "error",
        msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !",
      });
    }
  },
  getGroupsInCourse: async (req, res) => {
    const { courseToken } = req.body;

    const groups = await GroupModel.find({ courseToken });

    groups.sort((g) => g.title);
    return res.json(groups);
  },

  getGroup: async (req, res) => {
    const { groupToken } = req.params;
    try {
      const group = await GroupModel.findOne({ token: groupToken });
      const assignments = await AssignmentModel.find({
        courseToken: group.courseToken,
      });
      console.log(assignments);
      const assignment = await AssignmentModel.find({
        assignmentToken: "assToken2",
      });
      return res.json({
        group,
        assignments,
        assignment,
      });
    } catch (err) {
      return res.json({ err });
    }
  },
  updateParticipant: (req, res) => {
    const { participants } = req.body;
    GroupModel.findByIdAndUpdate(req.body.id, {
      participants: participants,
    })
      .then(() => {
        return res.status(204).json({
          success: true,
          message: "Update participant successfully",
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
  },
};
