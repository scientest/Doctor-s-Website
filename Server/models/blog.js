const mongoose = require("mongoose");

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
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            comment: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = mongoose.model("Blog", blogSchema);
