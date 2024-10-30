import mongoose from "mongoose";


const messageSchema =  new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users',
    },
    
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Users"
    },

    messageType: {
        type: String,
        enum: ["text","file"],
        required: true,
    },

    content: {
        type: String,
        required: function (){
            return this.messageType === "text";
        },
    },

    fileUrl: {
        type: String,
        required: function (){
            return this.messageType === "file";
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const Message = mongoose.model("Messages", messageSchema);

export default Message;