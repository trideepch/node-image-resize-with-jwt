'use strict';

const mongoose = require('mongoose');

// schema
const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    path: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.ObjectId,
        required: true
    },
    resource_id: {
        type: String,
        required: true,
        unique: true
    },
    processed: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'ERROR', 'COMPLETE'],
        default: 'PENDING'
    },
    thumbnail_path: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);