const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
{
    timestamps: true
});


module.exports = mongoose.model("Attachment", attachmentSchema);
