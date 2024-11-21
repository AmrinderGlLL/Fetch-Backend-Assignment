const mongoose = require('mongoose');

// Define the schema for transactions
const TransactionSchema = new mongoose.Schema({
    payer: {
        type: String,
        required: true, // Payer name is mandatory
    },
    points: {
        type: Number,
        required: true, // Points value is mandatory
    },
    timestamp: {
        type: Date,
        default: Date.now, // Timestamp is optional
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
