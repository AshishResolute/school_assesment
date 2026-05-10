# School Management API

A REST API built with Node.js, Express.js, and MySQL to manage school data. Supports adding schools and retrieving them sorted by proximity to a user-specified location.

---

## Live API

```
https://school-assesment.onrender.com
```

> **Note:** Hosted on Render's free tier. The server may take **20-30 seconds** to respond on the first request after inactivity.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (hosted on Railway)
- **Validation:** Joi
- **Hosting:** Render (server) + Railway (database)

---

## Database Schema

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  UNIQUE KEY unique_school (name, address)
);
```

---

## API Reference

### 1. Add School

**Endpoint:** `POST /addSchool`

**Description:** Validates and adds a new school to the database.

**Request Body:**
```json
{
  "name": "Delhi Public School",
  "address": "RK Puram, New Delhi",
  "latitude": 28.5672,
  "longitude": 77.1833
}
```

**Validation Rules:**
- `name` — required, string, min 3 chars, max 255 chars
- `address` — required, string, min 3 chars, max 255 chars
- `latitude` — required, number, between -90 and 90
- `longitude` — required, number, between -180 and 180

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "message": "School data recorded!",
  "SchoolId": 1,
  "timeStamp": "4/9/2026, 3:00:00 PM"
}
```

**Error Responses:**

`400 Bad Request` — Invalid or missing fields
```json
{
  "status": 400,
  "message": "Invalid Input Provided"
}
```

`409 Conflict` — School with same name and address already exists
```json
{
  "status": 409,
  "message": "School already exists"
}
```

---

### 2. List Schools

**Endpoint:** `GET /listSchools`

**Description:** Fetches all schools sorted by proximity to the user's location using the Haversine formula.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| latitude | number | Yes | User's latitude (-90 to 90) |
| longitude | number | Yes | User's longitude (-180 to 180) |

**Example Request:**
```
GET /listSchools?latitude=12.97&longitude=77.59
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "List of near by schools:",
  "userCo_ordinates": "12.97,77.59",
  "schoolsCount": 3,
  "schools": [
    {
      "id": 2,
      "name": "Kendriya Vidyalaya",
      "address": "Jayanagar, Bengaluru",
      "latitude": 12.925,
      "longitude": 77.5938,
      "distance": "0.54 kms"
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "RK Puram, New Delhi",
      "latitude": 28.5672,
      "longitude": 77.1833,
      "distance": "1754.23 kms"
    }
  ],
  "timeStamp": "4/9/2026, 3:00:00 PM"
}
```

**Empty Response — `200 OK`:**
```json
{
  "message": "No School Data is present yet!",
  "timeStamp": "4/9/2026, 3:00:00 PM"
}
```

**Error Response — `400 Bad Request`:**
```json
{
  "status": 400,
  "message": "Invalid user co-ordinates provided"
}
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MySQL

### Steps

1. Clone the repository:
```bash
git clone https://github.com/AshishResolute/school_assesment.git
cd school_assesment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root:
```env
SERVER_PORT=3000
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_user
DB_NAME=your_database_name
DB_PASSWORD=your_mysql_password
```

4. Create the database table:
```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  UNIQUE KEY unique_school (name, address)
);
```

5. Start the server:
```bash
node src/server/server.js
```

---

## Postman Testing

Import the `postman/school-management.json` file from this repository into Postman to get pre-built requests for both APIs.

**Sample test data for `/addSchool`:**

```json
{ "name": "Delhi Public School", "address": "RK Puram, New Delhi", "latitude": 28.5672, "longitude": 77.1833 }
{ "name": "Kendriya Vidyalaya", "address": "Jayanagar, Bengaluru", "latitude": 12.9250, "longitude": 77.5938 }
{ "name": "Bishop Cotton School", "address": "Shimla, Himachal Pradesh", "latitude": 31.1048, "longitude": 77.1734 }
```

**Sample test for `/listSchools`:**
```
GET /listSchools?latitude=12.97&longitude=77.59
```

---

## Project Structure

```
├── src/
│   ├── server/
│   │   └── server.js
│   ├── routes/
│   │   └── schools.js
│   ├── controllers/
│   │   └── schoolController.js
│   ├── database/
│   │   └── db.js
│   └── ErrorHandler/
│       └── Errorhandler.js
├── postman/
│   └── school-management.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Author

Ashish.
