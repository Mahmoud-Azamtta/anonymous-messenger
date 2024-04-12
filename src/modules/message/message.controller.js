import messageModel from "../../../DB/models/message.model.js";
import userModel from "../../../DB/models/user.model.js";

export const sendMessage = async (req, res) => {
  const { id, content } = req.body;

  const reciever = await userModel.findById(id);
  if (!reciever) {
    return res
      .status(400)
      .json({ message: "An error occured, reciever ID not found" });
  }

  const newMessage = await messageModel.create({ receiverId: id, content });
  if (!newMessage) {
    return res.status(400).json({ message: "An able to send your message" });
  }

  return res.status(200).json({ message: "success" });
};

export const getMessages = async (req, res) => {
  const id = req.user._id;

  const messages = await messageModel
    .find({ receiverId: id })
    .select("content createdAt updatedAt");
  if (!messages)
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json({ message: "success", messages });
};
