const express = require("express");
const router = express.Router();

const blogModel = require("../models/blog");
const { isLoggedIn } = require("../Controllers/AuthController");




router.post("/blogs/:id", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const { title, description } = req.body;
    const blog = new blogModel({
        title,
        description,
        author:user1._id
    });
    await blog.save();
    user1.blogs.push(blog._id);
    await user1.save();
    res.status(201).json({ message: "Blog created successfully",blog});
});


//edit
router.put("/blogs/edit/:id/:blogId", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const blog = await blogModel.findById(req.params.blogId);
    blog.title = req.body.title;
    blog.description = req.body.description;
    await blog.save();
   res.status(200).json({ message: "Blog updated successfully",blog});
})

//likes
router.put("/blogs/like/:blogId", isLoggedIn,async(req, res) => {
    const user1 = req.userId;
    const blog = await blogModel.findById(req.params.blogId);
    blog.likes.push(user1);
    await blog.save();
    res.status(200).json({ message: "Blog liked successfully",blog});
})

//dislikes
router.put("/blogs/dislike/:blogId", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const blog = await blogModel.findById(req.params.blogId);
    blog.likes.pull(user1._id);
    await blog.save();
    res.status(200).json({ message: "Blog disliked successfully",blog});
})

//delete
router.delete("/blogs/delete/:id/:blogId", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const blog = await blogModel.findByIdAndDelete(req.params.blogId);
    user1.blogs.pull(blog._id);
    await user1.save();
    res.status(200).json({ message: "Blog deleted successfully",blog});
})

//comment
router.put("/blogs/comment/:blogId", isLoggedIn,async(req, res)=>{
     const user1 =req.userId;
    const { comment } = req.body;
    const blog = await blogModel.findById(req.params.blogId);
    blog.comments.push({
        user: user1,
        comment: comment
    });
    await blog.save();
    res.status(200).json({ message: "Comment added successfully",blog});
});

//filter blogs by author
router.get("/blogs/author/:authorId", isLoggedIn,async(req, res) => {
    const authorId = req.params.authorId;
    const blogs = await blogModel.find({ author: authorId });
    res.status(200).json({ message: "Blogs fetched successfully",blogs});
});

//search blogs by title

// Search blogs by keyword
router.get("/blogs/search", async (req, res) => {
    const { query } = req.query; // e.g., /blogs/search?query=somekeyword

    if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Case-insensitive search on title and description
        const blogs = await blogModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        });

        res.status(200).json({ message: "Blogs fetched successfully", blogs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;