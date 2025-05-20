const Chat = require('../models/chat.model');
const Conversation = require('../models/conversation.model');
const Attachment = require('../models/attachment.model');

/**
 * @description Create a new chat between user and car owner
 */
let addChat = async (req, res) => {
  try {
    const { car, owner } = req.body;
    const user = req.user;

    // Create query object to check for existing chat
    let findObject = { 
      "car._id": car._id,
      "user._id": user._id,
      "owner._id": owner._id
    };

    // Check if chat already exists between these parties
    const existingChat = await Chat.findOne(findObject);
    if (existingChat) {
      return res.status(400).json({ status: false, message: "Chat already exists" });
    }

    // Create and save new chat
    const newChat = new Chat({
      car,
      user,
      owner
    });
    await newChat.save();

    res.status(201).json({ status: true, message: "Chat added successfully", data: newChat });
  }
  catch(error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @description Get all chats for the authenticated user
 */
let getChats = async (req, res) => {
  try {
    let userId = req.user._id;
    
    // Find all chats where user is either the owner or the customer
    let chats = await Chat.find({ $or: [{ "user._id": userId }, { "owner._id": userId }] });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/**
 * @description Add a new message to an existing chat
 */
let addMessage = async (req, res) => {
  try {
    let { message, imageUrl } = req.body;
    const chatId = req.params.id;
    const userId = req.user._id;
    
    // Verify chat exists and user is a participant
    const chat = await Chat.findOne({
      "_id": chatId, 
      $or: [{ "user._id": userId }, { "owner._id": userId }]
    });
    
    if (!chat) {
      return res.status(404).json({ status: false, message: "Chat not found" });
    }

    let attachment;
    if(imageUrl){
        attachment = new Attachment({
        imageUrl,
        chatId,
        senderId: userId
      });
      await attachment.save();
    }



   
    // Create and save new message in conversation
    let conversation = new Conversation({
      message,
      attachment, 
      sender: userId, 
      chatId
    });
    await conversation.save();
    
    res.status(200).json({ 
      status: true, 
      message: "Message added successfully", 
      data: conversation 
    });
  }
  catch(error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * @description Get all messages in a conversation for a specific chat
 */
let getConversations = async (req, res) => {
  try {
    let chatId = req.params.id;
    
    // Find all messages for the specified chat
    let conversations = await Conversation.find({ chatId });
    
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Export controller functions
module.exports = { 
  addChat, 
  getChats, 
  addMessage, 
  getConversations 
};