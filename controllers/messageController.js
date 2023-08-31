const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const { validationResult, body } = require("express-validator");
const { title } = require("process");

exports.create_message_get = (req, res, next) => {
  console.log("user: " + req.user);
  res.render("message_form", {
    pageTitle: "Create Message",
  });
};

exports.create_message_post = [
  body("title", "title is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("title must be at least one letter")
    .escape(),
  body("content", "Message is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("message must be at least one letter")
    .escape(),

  expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
    });

    // look at library example to see how to do the author in this
    // since it is a ref

    console.log(req.user);

    if (!errors.isEmpty()) {
      res.render("message_form", {
        pageTitle: "Create Message",
        postTitle: message.title,
        message: message,
        errors: errors.array(),
      });
    } else {
      const newMessage = await message.save();
      res.redirect("/");
    }
  }),
];

exports.message_list = expressAsyncHandler(async (req, res, next) => {
  const allMessages = await Message.find()
    .populate("author")
    .sort({ creation_date: -1 })
    .exec();
  console.log(allMessages);


  res.render("index", {
    pageTitle: "Members Only",
    title: "Message",
    messages: allMessages,
  });
});
