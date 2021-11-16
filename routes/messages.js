const express = require('express');
const { ensureAuthenticated } = require('../helpers/auth');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../models/User")
const Message = require("../models/Message")

//! Message Get
router.get("/", ensureAuthenticated, (req, res, next) => {
  if (!res.locals.currentUser) res.redirect("/login")
  Message.find({}, (err, messages) => {
    if (err) return next(err)

    res.render("messages", {
      title: "Messages Page",
      messages,
      user: res.locals.currentUser
    })
  })
})

//! Create Message Get
router.get("/create-message", ensureAuthenticated, (req, res, next) => {
  if (!res.locals.currentUser) res.redirect("/login")
  res.render("message_form", { title: "Messages Page", user: res.locals.currentUser })
})

//! Create Message Post
router.post("/create-message", ensureAuthenticated, [
  body("messageTitle").trim().isLength({ min: 1 }).withMessage("Title must not be empty"),
  body('messageText').trim().isLength({ min: 1 }).withMessage("Message Text must not be empty"),

  async (req, res, next) => {
    const { messageTitle, messageText } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message_form", { title: "Create a Message", errors: errors.array() })
    }

    const message = new Message({
      user: req.user._id,
      title: messageTitle,
      text: messageText,
      timestamp: Date.now(),
    })

    await message.save((err) => {
      if (err) next(err)
      res.redirect("/messages")
    })

    User.findById(req.user._id, (err, user) => {
      if (err) next(err)
      user.messages.push(message._id)
      user.save((err) => {
        if (err) next(err)
      })
    })
  }
])

//! Message Detail get
router.get("/:id", ensureAuthenticated, (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) return next(err)
    const editablePost = req.user._id.equals(message.user._id)
    console.log("editable: ", editablePost)

    res.render("message_detail", {
      title: "Message Detail",
      user: res.locals.currentUser,
      message,
      editablePost
    })
  })
})

//! Meesage Get 
router.get("/:id/delete", ensureAuthenticated, (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) next(err)
    res.render("message_delete", {
      title: "Delete Message",
      user: res.locals.currentUser,
      message
    })
  })
})

//! Meesage Delete Post
router.post("/:id/delete", ensureAuthenticated, (req, res, next) => {
  Message.findByIdAndDelete(req.params.id, (err) => {
    if (err) return next(err)
    res.redirect("/messages")
  })
})

//! Message Update Get
router.get("/:id/update", ensureAuthenticated, (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) return next(err)
    res.render("message_update", {
      title: "Update Message",
      user: res.locals.currentUser,
      message
    })
  })
})

//! Message Update Post
router.post("/:id/update", ensureAuthenticated, (req, res, next) => {
  Message.findByIdAndUpdate(req.params.id, {
    title: req.body.messageTitle,
    text: req.body.messageText
  }, (err) => {
    if (err) return next(err)
    res.redirect("/messages")
  })
})

module.exports = router;