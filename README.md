# Fetch-Backend-Assignment
Fetch Points Tracker: A REST API to handle user points transactions, supporting adding points, spending points, and fetching payer-specific balances.

Points Tracker API
Overview
The Points Tracker API is a backend system built to manage points for a single user. It supports adding, spending, and viewing the balance of points for multiple payers while adhering to business rules such as oldest-first (FIFO) deductions.

This project is designed as a take-home assignment to demonstrate the ability to create a functional, efficient, and maintainable API.

Setup Instructions
1. Clone the Repository
bash
Copy code
git clone <repository-url>
cd points-tracker
2. Install Dependencies
bash
Copy code
npm install
3. Configure Environment Variables
Create a .env file in the project root and add the following:

env
Copy code
MONGO_URI=<Your MongoDB connection string>
PORT=8000
Replace <Your MongoDB connection string> with your MongoDB connection string (local or Atlas).
Default PORT is 8000.
4. Start the Server
bash
Copy code
npm start
The server will start at http://localhost:8000.


