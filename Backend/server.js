const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
// **MODIFIED FOR RENDER**
// Render provides the PORT environment variable.
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-very-secret-key-that-is-long-and-secure';

// --- IMPORTANT: This should be set in Render's Environment Variables ---
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---

// Explicitly allow requests only from your live frontend URL
const corsOptions = {
  origin: 'https://stray-n-stray-project.vercel.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Middleware to Authenticate JWT ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


// --- MOCK DATA ---
const hotelsData = [
    { _id: new ObjectId(), name: 'The Grand Plaza Hotel', location: 'Manhattan, New York', price: 23999, rating: 4.8, amenities: ['Free WiFi', 'Pool', 'Gym'], imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', description: 'Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities.' },
    { _id: new ObjectId(), name: 'Boutique Central Hotel', location: 'Midtown, New York', price: 14999, rating: 4.5, amenities: ['Free WiFi', 'Breakfast', 'Concierge'], imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop', description: 'Charming boutique hotel with personalized service and unique design in the heart of the city.' },
    { _id: new ObjectId(), name: 'Business Suites Manhattan', location: 'Financial District, New York', price: 19500, rating: 4.3, amenities: ['Free WiFi', 'Business Center', 'Gym'], imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop', description: 'Modern business hotel perfect for corporate travelers with excellent meeting facilities.' },
];
const flightsData = [
    { _id: new ObjectId(), from: { code: 'NYC', city: 'New York' }, to: { code: 'LAX', city: 'Los Angeles' }, departureTime: '8:30', arrivalTime: '14:15', duration: '5h 45m', airline: 'American Airlines', price: 28500 },
    { _id: new ObjectId(), from: { code: 'NYC', city: 'New York' }, to: { code: 'LAX', city: 'Los Angeles' }, departureTime: '10:00', arrivalTime: '15:45', duration: '5h 45m', airline: 'Delta Airlines', price: 31000 },
    { _id: new ObjectId(), from: { code: 'DEL', city: 'Delhi' }, to: { code: 'BOM', city: 'Mumbai' }, departureTime: '06:00', arrivalTime: '08:05', duration: '2h 05m', airline: 'Vistara', price: 5200 },
    { _id: new ObjectId(), from: { code: 'DEL', city: 'Delhi' }, to: { code: 'BOM', city: 'Mumbai' }, departureTime: '07:30', arrivalTime: '09:40', duration: '2h 10m', airline: 'IndiGo', price: 4800 },
];
const trainsData = [
    { _id: new ObjectId(), name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', departureTime: '16:55', arrivalTime: '08:15', price: 4500 },
    { _id: new ObjectId(), name: 'Duronto Express', from: 'Mumbai', to: 'Delhi', departureTime: '23:00', arrivalTime: '15:55', price: 4200 },
    { _id: new ObjectId(), name: 'Shatabdi Express', from: 'Delhi', to: 'Agra', departureTime: '06:00', arrivalTime: '08:06', price: 1200 },
];

let db;

// --- API ROUTES (abbreviated for clarity) ---
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: "All fields are required." });
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) return res.status(409).json({ message: "Email is already in use." });
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('users').insertOne({ firstName, lastName, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) { res.status(500).json({ message: "Server error." }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
    } catch (error) { res.status(500).json({ message: "Server error." }); }
});

app.get('/api/hotels', (req, res) => res.json(hotelsData));
app.get('/api/flights', (req, res) => res.json(flightsData));
app.get('/api/trains', (req, res) => res.json(trainsData));

app.post('/api/bookings', authenticateToken, async (req, res) => {
    try {
        const bookingDetails = req.body;
        const userId = req.user.id;
        const bookingDocument = {
            userId: new ObjectId(userId),
            bookingType: bookingDetails.bookingType,
            details: bookingDetails,
            totalAmount: bookingDetails.bookingType === 'hotel' ? bookingDetails.hotel.price : bookingDetails.flight.price,
            createdAt: new Date(),
            status: 'Confirmed'
        };
        const result = await db.collection('bookings').insertOne(bookingDocument);
        const newBooking = await db.collection('bookings').findOne({_id: result.insertedId});
        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    } catch (error) { res.status(500).json({ message: "Server error." }); }
});

app.get('/api/my-bookings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await db.collection('bookings').find({ userId: new ObjectId(userId) }).toArray();
        res.json(bookings);
    } catch (error) { res.status(500).json({ message: "Server error." }); }
});


// --- Connect to MongoDB and Start Server ---
const client = new MongoClient(MONGO_URI);
async function connectToDbAndStartServer() {
    if (!MONGO_URI) {
        console.error("FATAL ERROR: MONGO_URI environment variable is not set.");
        process.exit(1);
    }
    try {
        await client.connect();
        db = client.db("StayNStrayDB");
        console.log("Successfully connected to MongoDB!");
        
        // ** MODIFIED FOR RENDER **
        // The 'host' parameter is crucial for deployment platforms like Render.
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

connectToDbAndStartServer();