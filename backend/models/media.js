const mongoose = require('mongoose');

const MediaScheam = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    fileType: {
        type: String
    }
}, { timestamps: true });

const Media = mongoose.model('Media', MediaScheam);

module.exports = Media;
