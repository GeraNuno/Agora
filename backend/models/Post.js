const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencia al modelo de usuario
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Referencia a los comentarios
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
