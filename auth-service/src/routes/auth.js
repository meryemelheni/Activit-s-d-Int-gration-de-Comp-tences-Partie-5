// auth-service/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// GET - Login page (returns HTML form)
router.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Auth Service - Login</title>
            <style>
                body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
                .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; }
                h1 { color: #333; text-align: center; }
                form { display: flex; flex-direction: column; gap: 15px; }
                input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
                button { padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
                button:hover { background: #0056b3; }
                .link { text-align: center; margin-top: 15px; }
                a { color: #007bff; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔐 Login</h1>
                <form method="POST" action="/auth/login">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                <div class="link">
                    Don't have an account? <a href="/auth/register">Register here</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// GET - Register page (returns HTML form)
router.get('/register', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Auth Service - Register</title>
            <style>
                body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
                .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; }
                h1 { color: #333; text-align: center; }
                form { display: flex; flex-direction: column; gap: 15px; }
                input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
                button { padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
                button:hover { background: #218838; }
                .link { text-align: center; margin-top: 15px; }
                a { color: #007bff; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📝 Register</h1>
                <form method="POST" action="/auth/register">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Register</button>
                </form>
                <div class="link">
                    Already have an account? <a href="/auth/login">Login here</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Inscription
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });
        
        res.status(201).json({ 
            success: true,
            message: "User registered successfully",
            id: user._id, 
            username: user.username 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: "Erreur lors de l'inscription", error: error.message });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Identifiants invalides' });
        }
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'votre_secret_jwt_ici',
            { expiresIn: '1h' }
        );
        res.json({ 
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la connexion", error: error.message });
    }
});

module.exports = router;
