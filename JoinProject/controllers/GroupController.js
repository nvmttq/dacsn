const GroupModel = require("../models/groupModel.js");
const UserModel = require("../models/userModel.js");
const shortid = require('shortid');

module.exports = {
  CreateGroup: async (req, res) => {
    const { nameGroup, user } = req.body;
    try {
      const groupToken = shortid.generate();
      const group = new GroupModel({
        token: groupToken,
        title: nameGroup,
        participants: [{ idUser: user.username, isCreator: true }]
      });

      const saveGroup = await group.save();
      await UserModel.findOneAndUpdate({ username: user.username }, {
        $push: {
          groups: groupToken
        }
      });
      console.log(group)
      res.json({
        severity: "success",
        msg: `Tạo khóa học thành công`,
      });
    } catch (err) {
      res.json({
        severity: "error",
        msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !"
      });
    }
  },
};
