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
    image: {
        type: String,
        required: true,
    },
    author: {
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    date: {
        type: Date,
        default: Date.now},
    likes: {
        type: Array,
        default: [{type:mongoose.Schema.Types.ObjectId, ref:"user"}]
    }
},
);

module.exports = mongoose.model("blog", blogSchema);
