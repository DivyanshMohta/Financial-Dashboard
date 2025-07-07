# Financial Analytics Dashboard

A full-stack financial application with dynamic data visualization, advanced filtering, and configurable CSV export functionality. Built for financial analysts to track and analyze company transactions.

## 🚀 Features

### Core Functionality

- **Interactive Dashboard** with real-time financial analytics
- **Transaction Management** with advanced search, sort, and filter capabilities
- **Data Visualization** using charts and graphs
- **CSV Export** with configurable columns
- **JWT Authentication** with secure endpoints
- **Responsive Design** for all devices

### Dashboard Features

- Revenue vs Expenses trends visualization
- Category breakdown charts
- Summary metrics cards
- Recent transactions display
- Top users by transaction volume

### Transaction Management

- Paginated transaction listing
- Multi-field filtering ( Amount, Category, Status, User)
- Real-time search across all fields
- Column-based sorting with visual indicators
- Advanced filter combinations

### Export System

- Configurable CSV export with column selection
- Automatic file download
- Filter-based export (respects current filters)
- Proper CSV formatting with headers

## 🛠️ Tech Stack

### Frontend

- **React.js** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API communication
- **React Query** for state management

### Backend

- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **csv-writer** for CSV generation
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Loopr-Assignment
```

### 2. Install Dependencies

#### Backend Setup

```bash
cd server
npm install
```

#### Frontend Setup

```bash
cd client
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://localhost:27017/financial_analytics
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Load Sample Data (Optional)

```bash
# Navigate to server directory
cd server

# Run the sample data script (if available)
npm run seed
```

### 6. Start the Application

#### Start Backend Server

```bash
cd server
npm run dev
```

Server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd client
npm run dev
```

Frontend will start on `http://localhost:5173`

## 📖 Usage Guide

### 1. Authentication

1. Navigate to the application
2. Register a new account or login with existing credentials
3. JWT token will be automatically stored and used for API requests

### 2. Dashboard

- View financial summary cards with key metrics
- Analyze revenue vs expenses trends
- Check category breakdown
- Monitor recent transactions
- View top users by transaction volume

### 3. Transaction Management

- Navigate to "Transactions" page
- Use search bar for quick filtering
- Apply advanced filters (category, status, amount range, user)
- Sort by any column (click column headers)
- Navigate through pages using pagination controls

### 4. CSV Export

1. Go to Transactions page
2. Apply desired filters
3. Click "Export CSV" button
4. Select columns to include in export
5. Click "Export CSV" to download file

## 🔧 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Get User Profile

```http
GET /auth/profile
Authorization: Bearer <token>
```

### Transaction Endpoints

#### Get Transactions

```http
GET /transactions?page=1&limit=10&sortBy=date&order=desc
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (number): Page number for pagination
- `limit` (number): Number of items per page (1-100)
- `sortBy` (string): Field to sort by (id, date, amount, category, status, user_id)
- `order` (string): Sort order (asc, desc)
- `category` (string): Filter by category (Revenue, Expense)
- `status` (string): Filter by status (Paid, Pending)
- `user_id` (string): Filter by user ID
- `search` (string): Search across multiple fields
- `minAmount` (number): Minimum amount filter
- `maxAmount` (number): Maximum amount filter
- `startDate` (string): Start date for date range filter
- `endDate` (string): End date for date range filter

#### Get Analytics Data

```http
GET /transactions/analytics?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### Get Filter Options

```http
GET /transactions/filters
Authorization: Bearer <token>
```

#### Export CSV

```http
POST /transactions/export
Authorization: Bearer <token>
Content-Type: application/json

{
  "columns": ["id", "date", "amount", "category", "status", "user_id"],
  "category": "Revenue",
  "status": "Paid",
  "search": "test",
  "sortBy": "date",
  "order": "desc"
}
```

### System Endpoints

#### Health Check

```http
GET /health
```

## 📊 CSV Export Format

The CSV export functionality generates properly formatted CSV files with the following features:

### Supported Columns

- `id`: Transaction ID
- `date`: Transaction date
- `amount`: Transaction amount
- `category`: Transaction category (Revenue/Expense)
- `status`: Transaction status (Paid/Pending)
- `user_id`: User identifier
- `user_profile`: User profile information

### CSV Format

```csv
id,date,amount,category,status,user_id
1,2024-01-15,1500.00,Revenue,Paid,user123
2,2024-01-16,750.50,Expense,Pending,user456
```

### Export Features

- **Column Selection**: Choose which fields to include
- **Filter Respect**: Exports only filtered data
- **Sorting**: Maintains current sort order
- **Auto-download**: Files download automatically
- **Proper Headers**: CSV includes column headers
- **Date Formatting**: Consistent date formatting

## 🚨 Error Handling

The application implements comprehensive error handling:

### Frontend Error Handling

- **Toast Notifications**: User-friendly error messages
- **Loading States**: Visual feedback during operations
- **Form Validation**: Real-time input validation
- **Network Error Handling**: Graceful handling of API failures

### Backend Error Handling

- **Input Validation**: Comprehensive parameter validation
- **Authentication Errors**: Proper JWT validation
- **Database Errors**: MongoDB error handling
- **Global Error Handler**: Consistent error responses

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional error details",
  "field": "Specific field causing error"
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against abuse
- **Secure Headers**: Proper HTTP security headers

## 📄 License

This project is licensed under the MIT License.

