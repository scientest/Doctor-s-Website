const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const blogModel = require("../models/blog");
const { isLoggedIn } = require("../Controllers/AuthController");




router.post("/blog/add", isLoggedIn,async(req, res) => {
    const userId = req.userId;
    const user1 = await userModel.findById(userId);
    if (!user1) {
        return res.status(404).json({ message: "User not found" });
    }
    const { title, description } = req.body;
    const blog = new blogModel({
        title,
        description,
        author:user1._id
    });
    await blog.save();
    await user1.blogs.push(blog._id);
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


//filter blogs by author
router.get("/blogs/author/:authorId", isLoggedIn,async(req, res) => {
    const authorId = req.params.authorId;
    const blogs = await blogModel.find({ author: authorId });
    res.status(200).json({ message: "Blogs fetched successfully",blogs});
});

// Get all blogs
router.get("/blogs", async (req, res) => {
    try {
        const blogs = await blogModel.find().populate(
            path= "author",
            select= "name image"
        );
        res.status(200).json({ message: "Blogs fetched successfully", blogs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a single blog by ID
router.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id).populate("author", "name image");
        res.status(200).json({ message: "Blog fetched successfully", blog });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

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

// Add comment to blog or reply to a comment
router.post("/comments/add/:blogId",isLoggedIn, async (req, res) => {
  try {
    const blogId = req.params.blogId;
     const {text,parentId} = req.body;// parentId is optional for direct comments
    if (!text) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const newComment = {
       content: text,
        user: req.userId, // Assuming req.user contains the authenticated user
      replies: [],
    };

    if (parentId) {
      // Find the root comment (A)
      const findRootComment = (comments, parentId) => {
        for (let comment of comments) {
          if (comment._id.equals(parentId)) {
            return comment;
          }
          const foundComment = findRootComment(comment.replies, parentId);
          if (foundComment) return foundComment;
        }
        return null;
      };
        
      const rootComment = findRootComment(blog.comments);

      if (rootComment) {
        // Add the new comment directly under the root comment (A)
        rootComment.replies.push(newComment);
      } else {
        return res.status(404).json({ error: "Root comment not found" });
      }
    } else {
      blog.comments.push(newComment);
    }

    await blog.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get comments of a blog and replies of a comment
router.get("/comments/:blogId", async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const blog = await blogModel.findById(blogId).populate({
            path: "comments",
            populate: {
                path: "replies user",
                select: "name image content createdAt"
            },
        });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json({ message: "Comments fetched successfully", comments: blog.comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;