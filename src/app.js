const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const pointsRoutes = require('./routes/pointsRoutes'); // Import points routes
const PORT = process.env.PORT || 8000;
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to database
connectDB();

// Use routes
app.use('/api', pointsRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.send('API is running...');
});
