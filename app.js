require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const app = express();

// Configuración de body-parser y cors
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});

// Ruta principal - Leer productos
app.get('/', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('index', { productos: results });
    });
});

// Ruta para crear un nuevo producto
app.post('/producto', (req, res) => {
    const { nombre, precio, categoria } = req.body;
    const query = 'INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)';
    db.query(query, [nombre, precio, categoria], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
});

// Ruta para actualizar un producto
app.post('/producto/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria } = req.body;
    const query = 'UPDATE productos SET nombre = ?, precio = ?, categoria = ? WHERE id = ?';
    db.query(query, [nombre, precio, categoria, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
});

// Ruta para eliminar un producto
app.get('/producto/eliminar/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
