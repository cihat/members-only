const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  member: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    required: true,
    enum: [
      "jonathan",
      "joseph",
      "jotaro",
      "josuke",
      "giorno",
      "jolyne",
    ],
    default: "jonathan"
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]
})

const User = mongoose.model('User', UserSchema);

module.exports = User