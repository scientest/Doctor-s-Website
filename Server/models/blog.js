const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    }
});

module.exports = mongoose.model("Blog", blogSchema);