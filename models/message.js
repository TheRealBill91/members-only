const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  creation_date: { type: Date, default: Date.now },
});

// Virtual for message URL
MessageSchema.virtual("url").get(function () {
  return `/messages/message/${this._id}`;
});

// Virtual for formatted date/time message creation
MessageSchema.virtual("formatted_date_stamp").get(function () {
  const formattedDate = DateTime.fromJSDate(this.creation_date, {
    zone: "utc",
  }).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

  const dayAndMonth = formattedDate.slice(0, -6);
  return dayAndMonth;
});



module.exports = mongoose.model("Message", MessageSchema);
