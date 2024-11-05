const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Asegúrate de tener un middleware de autenticación

// Ruta para crear un comentario
router.post('/:postId/comments', authenticate, async (req, res) => {
    const { content, idUser } = req.body;
    const { postId } = req.params;
    
    console.log('Received comment data:', { content, idUser }); // Log para verificar los datos
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        const comment = new Comment({
            content: content,
            creator: mongoose.Types.ObjectId(idUser), // Obtén el ID del usuario autenticado
        });
        //guardar el comentario
        const savedComment = await comment.save();

        // Actualizar el post para agregar el comentario
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: savedComment._id }, // Agregar el ID del comentario al post
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment' });
    }
});

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ruta para subir una imagen a Cloudinary
router.post('/upload-image', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: 'Agora'
        });
        res.json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

// Obtener todos los posts de una comunidad
router.get('/:communityId', async (req, res) => {
    try {
        const posts = await Post.find({ community: req.params.communityId })
            .populate('community')
            .populate('creator')
            .populate({
                path: 'comments',
                populate: { path: 'creator' } // Población para obtener información del creador de cada comentario
            })
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Crear un post nuevo en una comunidad
router.post('/create', async (req, res) => {
    const { title, content, community, createdBy, image } = req.body;
    console.log('Received data:', { title, content, community, createdBy, image }); // Log para verificar los datos

    try {
        const newPost = new Post({
            title,
            content,
            community: mongoose.Types.ObjectId(community),
            creator: mongoose.Types.ObjectId(createdBy),
            image: image || null // Guardar la URL de la imagen si está disponible
        });
        await newPost.save();

        // Realizar el populate sin `execPopulate`
        await newPost.populate('creator');

        // Devolver el post con los datos poblados
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

// Crear un post sin comunidad
router.post('/create/without-community', async (req, res) => {
    const { title, content, createdBy, image } = req.body;
    console.log('Received data:', { title, content, createdBy, image }); // Log para verificar los datos

    try {
        const newPost = new Post({
            title,
            content,
            creator: mongoose.Types.ObjectId(createdBy),
            community: null,
            image: image || null // Guardar la URL de la imagen si está disponible
        });
        await newPost.save();

        // Realizar el populate sin `execPopulate`
        await newPost.populate('creator');

        // Devolver el post con los datos poblados
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post without community:', error);
        res.status(500).json({ message: 'Error creating post without community', error: error.message });
    }
});

// Obtener todos los posts que no pertenecen a ninguna comunidad
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ community: null })
            .populate('creator')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts without community:', error);
        res.status(500).json({ message: 'Error fetching posts without community' });
    }
});

module.exports = router;
