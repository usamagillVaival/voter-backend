const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/user");

const deleteConversation = async (req, res) => {
  const { conversationId, userId } = req.body;
  try {
    const updateConversationDeletedBy = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { $push: { deletedBy: userId } }
    );
    return res.status(200).json({
      message: "Conversation deleted successfully",
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const collectorGalleryConversation = async (req, res) => {
  try {
    const { senderId, receiverId, nftId, subject, textMessage, receiverEmail } =
      req.body;
    const findSenderUser = await User.findOne({ _id: senderId });
    // const findReceiverUser = await User.findOne({ _id: receiverId });
    let findReceiverUser;
    if (receiverEmail) {
      findReceiverUser = await User.findOne({ email: receiverEmail });
    } else {
      findReceiverUser = await User.findOne({
        artist_artwork: { $in: [nftId] },
      });
    }
    if (
      !(
        findSenderUser &&
        Object.keys(findSenderUser).length > 0 &&
        findReceiverUser?._doc?._id &&
        Object.keys(findReceiverUser?._doc?._id).length > 0
      )
    ) {
      throw "User not found";
    }
    const newConversation = new Conversation({
      members: [
        req.body.senderId,
        (findReceiverUser?._doc?._id).toString(),
        nftId,
      ],
      subject,
      lastMessage: new Date(),
      senders: [req.body.senderId],
      nft: nftId,
    });

    const savedConversation = await newConversation.save();
    const newMessage = new Message({
      conversationId: savedConversation._id,
      sender: senderId,
      receiver: (findReceiverUser?._doc?._id).toString(),
      nft: nftId,
      text: textMessage,
    });
    const savedConversationMessage = await newMessage.save();
    return res.status(200).json({
      message: `You sent a message to ${findReceiverUser?._doc?.name}`,
      data: savedConversation,
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const allConversationsOfAUser = async (req, res) => {
  try {
    const userDetails = await User.findOne({ _id: req.params.userId });
    if (!(userDetails && Object.keys(userDetails).length > 0)) {
      throw "User not found";
    }
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate("nft");
    return res.status(200).json({
      //   message: "New conversation added successfully",
      data: conversation,
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const sendMessageToUser = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      _id: req.body.conversationId,
      members: { $in: [req.body.sender] },
    });
    if (!(conversation && conversation.length > 0)) {
      throw "No such conversation found";
    }
    const newMessage = new Message(req.body);

    const savedMessage = await newMessage.save();
    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: req.body.conversationId },
      {
        lastMessage: new Date(),
        $push: { senders: req.body.sender },
      }
    );
    return res.status(200).json({
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const allMessagesOfAConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

module.exports = {
  collectorGalleryConversation,
  allConversationsOfAUser,
  sendMessageToUser,
  allMessagesOfAConversation,
  deleteConversation,
};
