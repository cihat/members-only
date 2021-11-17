const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

const Comment = mongoose.model("Comment", CommentSchema)

module.exports = Comment
