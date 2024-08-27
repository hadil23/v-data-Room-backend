const { messageModel } = require("../Models/message");
require('dotenv').config();

const getAllMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recepientId } = req.body;

    const messages = await messageModel
      .find({
        $or: [
          { senderId: senderId, recepientId: recepientId },
          { senderId: recepientId, recepientId: senderId },
        ],
      })
      .populate("senderId", "_id firstName");

    res.json(messages);
  } catch (error) {
    console.log(`Error retrieving messages: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recepientId, messageType, messageText } = req.body;

    if (!req.file && messageType !== "text") {
      return res.status(400).send({ message: "Please upload a file" });
    }

    const imageUrl = (() => {
      switch (messageType) {
        case "image":
          return `https://${process.env.PROD_HOST}/backend/uploads/images/${req.file.filename}`;
        case "audio":
          return `https://${process.env.PROD_HOST}/backend/uploads/audio/${req.file.filename}`;
        case "document":
          return `https://${process.env.PROD_HOST}/backend/uploads/${req.file.filename}`;
        default:
          return null;
      }
    })();

    const newMessage = new messageModel({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl,
    });

    await newMessage.save();
    await newMessage.populate("senderId", "_id firstName");
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(`Error adding message: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLastMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recepientId } = req.body;

    const lastMessage = await messageModel
      .findOne({
        $or: [
          { senderId: senderId, recepientId: recepientId },
          { senderId: recepientId, recepientId: senderId },
        ],
      })
      .sort({ timestamp: -1 });

    res.json(lastMessage);
  } catch (error) {
    console.log(`Error retrieving last message: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addMessage,
  getAllMessage,
  getLastMessage,
};
