const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DateTime} = require('luxon');

const MessageSchema = Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    },
    {timestamps: true}
);

MessageSchema
    .virtual('timestampFormatted')
    .get(function() {
        return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
    });

module.exports = mongoose.model('Message', MessageSchema);