const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});

// Virtual for message URL
MessageSchema.virtual("url").get(function () {
  return `/messages/message/${this._id}`;
});

// Virtual for formatted date/time message creation
MessageSchema.virtual("formatted_time_stamp").get(function () {
  return DateTime.fromJSDate(this.createdAt, { zone: "utc" }).toLocaleString(
    DateTime.DATETIME_SHORT
  );
});

module.exports = mongoose.model("Message", MessageSchema);
