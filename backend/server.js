// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const communityRoutes = require('./routes/communities');
const postRoutes = require('./routes/post'); // Importar rutas de posts
const authRoutes = require('./routes/auth'); // Asegúrate de que esto esté aquí


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes); // Usar rutas de posts
app.use('/api/auth', authRoutes); // Usar rutas de autenticación


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
