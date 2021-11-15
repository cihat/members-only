const express = require('express');
const router = express.Router();
const User = require("../models/User")

//! User detail get
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return next(err)

    User.findById(req.params.id).populate("messages").exec((err, messages) => {
      res.render("user_detail", {
        title: "User Detail",
        user,
        messages: messages.messages
      })
    })
  })
})

module.exports = router;