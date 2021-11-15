const express = require('express');
const router = express.Router();
const passport = require("passport")
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const { forwardAuthenticated, ensureAuthenticated } = require('../helpers/auth');

const User = require("../models/User")

router.get('/', forwardAuthenticated, (req, res, next) => {
  res.redirect('/login');
});

router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  res.render('dashboard', {
    user: req.user
  })
})

//! SignUp Get
router.get('/signup', forwardAuthenticated, (req, res) => res.render('signup'));

//! SignUp Post
router.post("/signup", [
  body("username").trim().isLength({ min: 1 }).escape().withMessage("Username must be at least 6 characters."),
  body("password").trim().isLength({ min: 1 }).escape().withMessage("Password must be at least 6 characters."),
  body("confirmPassword").trim().isLength({ min: 1 }).escape().withMessage("Password must be at least 6 characters.")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords don't match");
      return true
    }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("ERROR")
      return res.render("signup", {
        title: "Sign Up",
        passwordConfirmationError: "Password must be the same"
      })
    }
    try {
      const isUserInDB = await User.findOne({ username: req.body.username })
      if (isUserInDB) {
        return res.render("signup", {
          title: "Sign Up",
          error: "Username already exists"
        })
      }
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          member: false,
          admin: false,
          avatar: req.body.avatar
        }).save(err => err ? next(err) : res.redirect("/login"))
      })
    } catch (err) {
      return next(err)
    }
  }
])

//! Login Get
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

//! Login post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })(req, res, next);
});

//! Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


module.exports = router;