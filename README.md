
# **Points Tracker API**

## **Overview**
The **Points Tracker API** is a backend system built to manage points for a single user. It supports adding, spending, and viewing the balance of points for multiple payers while adhering to business rules such as **oldest-first (FIFO)** deductions.

This project is designed as a take-home assignment to demonstrate the ability to create a functional, efficient, and maintainable API.

---

## **Setup Instructions**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd points-tracker
```
### **2. Install Dependencies**
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env file in the project root and add the following:
```bash
MONGO_URI=<Your MongoDB connection string>
PORT=8000
```
- Replace `<Your MongoDB connection string>` with your MongoDB connection string (local or Atlas).
- Default `PORT` is `8000`.

### **4. Start the Server**
```bash
npm start
```
The server will start at http://localhost:8000.

## **Endpoints and Behavior**

### **1. Add Points**
- **Route**: `POST /add-points`
- **Description**: Adds positive or negative points for a payer. Handles both types of entries:
  - **Positive Points**:
    - Adds the specified points for the payer as a new transaction.
    - If no `timestamp` is provided, the current time is used.
  - **Negative Points**:
    - Deducts points for the specified payer using FIFO logic.
    - If the payer doesn’t exist or lacks sufficient points, the request is rejected.

### **2. Spend Points**
- **Route**: `POST /spend-points`
- **Description**: Deducts a specified number of points across all payers, following the FIFO rule.
- **Behavior**:
  - Calculates the total available points across all payers.
  - Validates that there are enough points to fulfill the request.
  - Deducts points from the oldest transactions for all payers.
  - Updates transactions in the database and returns a breakdown of the points deducted from each payer.

### **3. Get Balances**
- **Route**: `GET /balances`
- **Description**: Retrieves the current balance for each payer.
- **Behavior**:
  - Groups all transactions by payer.
  - Sums up the points for each payer to compute their balance.
  - Returns the balances in a JSON object format.

---

## **Assumptions and Decisions**

### **1. Single-User Context**
- The API is designed to manage points for a single user, tracking multiple payers within that scope.

### **2. Validation**
- All required fields (`payer` and `points`) are validated.
- Requests with invalid or missing data are rejected with appropriate error messages.

### **3. Negative Points Handling**
- Negative points are allowed in the **Add Points** endpoint and are used to deduct points specifically from the payer mentioned in the request.
- The deduction follows a **FIFO (First-In, First-Out)** rule, reducing points from the payer’s oldest transactions first.
- If the payer does not exist or does not have sufficient points to cover the deduction, the request is rejected with an appropriate error response.

### **4. Simplified Logic**
- Transactions with `0` points are retained for simplicity.
- No further optimization like transaction consolidation was implemented to avoid over-complication.
