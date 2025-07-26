const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    content: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    replies:[
        this
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    content: {
        type: String,
        required: true,
    },
    reply: [
        replySchema
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})
const blogSchema =new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    author: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    date: {
        type: Date,
        default: Date.now},
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    comments: [
       commentSchema
    ],
});

module.exports = mongoose.model("Blog", blogSchema);

