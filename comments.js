//Create new server
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const auth = require('../middleware/auth');

//Create a new comment
router.post('/comment', auth, async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Delete a comment
router.delete('/comment/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            res.status(404).send('Comment not found');
        }
        res.send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Update a comment
router.patch('/comment/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!comment) {
            res.status(404).send('Comment not found');
        }
        res.send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Get all comments
router.get('/comments', auth, async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Get all comments for a post
router.get('/comments/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).send('Post not found');
        }
        await post.populate('comments').execPopulate();
        res.send(post.comments);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;


