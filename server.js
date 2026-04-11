const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Mock Database (Data gets wiped if server restarts!)
const USERS_DB = [
    // Pre-populate with our test account so the original login still works
    { phone: '+918625924630', password: 'password123' }
];

// Registration Route
app.post('/api/register', (req, res) => {
    const { phone, password } = req.body;

    console.log(`\n📝 [NEW REGISTRATION ATTEMPT]`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`🔑 Password: ${password}`);

    if (!phone || !password) {
        console.log(`❌ Failed: Missing Fields`);
        return res.status(400).json({ success: false, message: 'Phone and password are required' });
    }

    // Check if phone is already registered
    const existingUser = USERS_DB.find(u => u.phone === phone);
    if (existingUser) {
        console.log(`❌ Failed: Phone already exists`);
        return res.status(409).json({ success: false, message: 'Phone number is already registered' });
    }

    // Save to Mock DB
    USERS_DB.push({ phone, password });
    console.log(`✅ Success! Total registered users: ${USERS_DB.length}`);
    console.log(`-----------------------`);

    return res.json({ 
        success: true, 
        message: 'Account created successfully!'
    });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { phone, password } = req.body;

    // Print the login attempt to the backend terminal screen
    console.log(`\n👉 [NEW LOGIN ATTEMPT]`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`🔑 Password: ${password}`);

    if (!phone || !password) {
        console.log(`❌ Failed: Missing Fields`);
        return res.status(400).json({ success: false, message: 'Phone and password are required' });
    }

    // Check credential securely against Mock DB
    const user = USERS_DB.find(u => u.phone === phone && u.password === password);

    if (user) {
        console.log(`✅ Login Success!`);
        console.log(`-----------------------`);
        return res.json({ 
            success: true, 
            message: 'Login successful', 
            token: 'mock-jwt-token-7x8y9z' 
        });
    }

    console.log(`❌ Failed: Invalid Credentials`);
    console.log(`-----------------------`);
    return res.status(401).json({ success: false, message: 'Invalid phone number or password' });
});

// Default route for health check
app.get('/', (req, res) => {
    res.send('Backend server is alive and running with Registration System active!');
});

// Start backend
app.listen(PORT, () => {
    console.log(`Backend server is running properly on http://localhost:${PORT}`);
    console.log(`Active Mock DB loaded. Initial Users: ${USERS_DB.length}`);
});
