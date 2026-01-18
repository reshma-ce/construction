const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
let cachedData = null;

const connectDB = async () => {
    if (cachedData) {
        return cachedData;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        cachedData = conn;
        return conn;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

// Connect to DB immediately (optional, but good for local)
connectDB();

// Import Model
const Contact = require('./models/Contact');

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        await connectDB();
        const { name, email, message } = req.body;

        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();

        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

// --- Admin API Routes ---

// Serve Admin Page specifically
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// GET All Messages
app.get('/api/messages', async (req, res) => {
    try {
        await connectDB();
        const messages = await Contact.find().sort({ submittedAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST New Message (Admin Manual Add)
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT Update Message
app.put('/api/messages/:id', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, email, message },
            { new: true }
        );
        res.json(updatedContact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE Message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fallback to index.html for root or unknown routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
