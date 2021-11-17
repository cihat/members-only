const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    autopopulate: { maxDepth: 1 }
  },
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50
  },
  text: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 5000
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: { maxDepth: 1 }
  }],
  // comments: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Comment',
  //   autopopulate: { maxDepth: 1 }
  // }],
  timestamp: {
    type: Date,
    default: Date.now,
    required: true

  }
})

MessageSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("yyyy-MM-dd HH:mm")
})

MessageSchema.plugin(require("mongoose-autopopulate"))

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;