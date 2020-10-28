const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

var ItemSchema = new Schema ({
    part:     { type: String, required: true, unique: true },
    quanity:  { type: Number, required: true },
    category: { type: String, required: true },
    note:     { type: String, required: false, default: 'N/A' },
    url:      { type: String, required: false, default: 'N/A' },

    created:  { type: Date, default: Date.now },
    owner:    {
        id:       { type: Schema.Types.ObjectId, ref: 'User', required: false},
        username: { type: String, required: false }
    }
})

module.exports = mongoose.model('Item', ItemSchema);