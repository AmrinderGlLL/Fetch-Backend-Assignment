const Transaction = require('../models/Transaction'); // Import the Transaction model

const addPoints = async (req, res) => {
    try {
        const { payer, points, timestamp } = req.body;

        // Handle positive points
        if (points > 0) {
            const transaction = new Transaction({
                payer,
                points,
                timestamp: timestamp || new Date(),
            });
            await transaction.save();
            return res.status(201).json({ message: "Transaction added successfully", transaction });
        }

        // Handle negative points
        if (points < 0) {
            let pointsToDeduct = -points; // Convert negative points to a positive number

            // Check if the payer exists and has sufficient points
            const transactions = await Transaction.find({ payer }).sort({ timestamp: 1 }); // Oldest-first

            if (!transactions.length) {
                return res.status(400).json({ error: `Payer ${payer} does not exist` });
            }


            // Calculate total points for the payer
            const totalPoints = transactions.reduce((sum, transaction) => sum + transaction.points, 0);

            if (totalPoints < pointsToDeduct) {
                return res.status(400).json({ error: `Insufficient points for ${payer}` });
            }

            // Deduct points using FIFO
            const updatedTransactions = [];
            for (const transaction of transactions) {
                if (pointsToDeduct <= 0) break; // Stop once the required amount is deducted

                const deduction = Math.min(pointsToDeduct, transaction.points);
                pointsToDeduct -= deduction;
                transaction.points -= deduction;

                // Save the transaction as 0 if all points are used up
                if (transaction.points === 0) {
                    updatedTransactions.push(transaction);
                } else {
                    updatedTransactions.push(transaction);
                }
            }

            // Save all updated transactions
            for (const transaction of updatedTransactions) {
                await transaction.save();
            }

            return res.status(200).json({
                message: "Points deducted successfully",
                payer,
                deducted: points,
            });
        }
    } catch (err) {
        console.error("Error processing points:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const spendPoints = async (req, res) => {
    try {
        let pointsToSpend = req.body.points;

        //Calculate the total available points across all transactions
        const totalPoints = await Transaction.aggregate([
            { $group: { _id: null, total: { $sum: "$points" } } },
        ]);

        const availablePoints = totalPoints[0]?.total || 0;

        //Check if the available points are less than the requested amount
        if (availablePoints < pointsToSpend) {
            return res.status(400).json({ error: "Not enough points to spend" });
        }

        //Fetch all transactions sorted by timestamp (oldest-first)
        const transactions = await Transaction.find().sort({ timestamp: 1 });

        //Deduct points and track deductions in a dictionary
        const spentPoints = {}; // Dictionary to track deductions

        for (const transaction of transactions) {
            if (pointsToSpend <= 0) break; // Stop once the requested points are spent

            const payer = transaction.payer;
            const availablePoints = transaction.points;

            if (availablePoints <= 0) continue; // Skip transactions with no usable points

            // Calculate the points to deduct
            const spend = Math.min(pointsToSpend, availablePoints);
            pointsToSpend -= spend;

            // Update the dictionary with points deducted from the payer
            spentPoints[payer] = (spentPoints[payer] || 0) - spend;

            // Adjust or remove the transaction from the database
            if (spend === availablePoints) {
                // Remove the transaction if all points are used up
                transaction.points = 0;
            } else {
                // Update the transaction with the remaining points
                transaction.points -= spend;
                
            }
            await transaction.save();
        }

        //Return the deductions
        const result = Object.entries(spentPoints).map(([payer, points]) => ({
            payer,
            points,
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error("Error spending points:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Controller to get the balance for all payers
const getBalances = async (req, res) => {
    try {
        const balances = await Transaction.aggregate([
            { $group: { _id: '$payer', total: { $sum: '$points' } } }
            
        ]);

        const result = balances.reduce((acc, item) => {
            acc[item._id] = item.total;
            return acc;
        }, {});

        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching balances:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { addPoints, spendPoints, getBalances };
