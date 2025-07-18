# 🗳️ Vote Management System – Backend API

A secure, RESTful backend service built with **Node.js**, **Express**, and **MongoDB** to manage user registration, voting processes, candidate management, and admin controls. Designed for real-world voting scenarios with features like age restrictions, one-time voting, role-based access, and token-based authentication.

> ✅ Ideal for government agencies, institutions, or organizations conducting internal elections.

---

## 📌 Features

### 👤 User Features
- Voter Signup and Login with JWT authentication
- Age verification (must be 18+ to vote)
- Secure password hashing using Bcrypt
- View profile
- Change password

### 🗳️ Candidate Features (Admin only)
- Add, update, and delete candidates
- Cast a vote for a candidate (voter can vote only once)
- List all candidates
- View real-time vote count results

### 🔐 Security
- JWT-based authentication middleware
- Password encryption
- Protected routes for admin/voter
- One-vote-per-user enforcement
- Secure API with CORS and Helmet (if added)

---

## 🧠 Models Summary

### 📄 `User` Model

| Field              | Type     | Required | Unique | Description                             |
|-------------------|----------|----------|--------|-----------------------------------------|
| name              | String   | ✅       | ❌     | Voter name                              |
| age               | Number   | ✅       | ❌     | Must be 18 or older                     |
| email             | String   | ✅       | ✅     | Email for login                         |
| mobile            | String   | ✅       | ✅     | Unique mobile number                    |
| address           | String   | ✅       | ❌     | Address of the user                     |
| aadharcardnumber  | Number   | ✅       | ✅     | Unique national ID                      |
| password          | String   | ✅       | ❌     | Hashed with bcrypt                      |
| role              | Enum     | ❌       | ❌     | `"voter"` (default) or `"admin"`        |
| isvoted           | Boolean  | ❌       | ❌     | To check if the user has already voted  |

### 📄 `Candidate` Model

| Field      | Type              | Required | Description                              |
|-----------|-------------------|----------|------------------------------------------|
| name      | String            | ✅       | Candidate's full name                    |
| party     | String            | ✅       | Political party name                     |
| age       | Number            | ✅       | Candidate age                            |
| votes     | [User + Date]     | ❌       | Array of voters and timestamps           |
| votecount | Number            | ❌       | Count of total votes (atomic increment) |

---

## 🛣️ API Endpoints

### 🔐 User Routes – `/api/user`

| Method | Endpoint                  | Protected | Description                      |
|--------|---------------------------|-----------|----------------------------------|
| POST   | `/signup`                | ❌        | Register new voter/admin         |
| POST   | `/login`                 | ❌        | Login with email & password      |
| GET    | `/profile`              | ✅        | Get user details via JWT         |
| PUT    | `/profile/changepassword` | ✅        | Update password                  |

---

### 🗳️ Candidate Routes – `/api/candidate`

| Method | Endpoint               | Protected | Description                                |
|--------|------------------------|-----------|--------------------------------------------|
| POST   | `/`                   | ✅        | Add new candidate (Admin only)             |
| PUT    | `/update/:id`         | ✅        | Update candidate details                   |
| DELETE | `/delete/:id`         | ✅        | Delete candidate by ID                     |
| POST   | `/vote/:id`           | ✅        | Vote for a candidate (voter only)          |
| GET    | `/vote/count`         | ❌        | Get vote count summary                     |
| GET    | `/listcandidate`      | ❌        | List all candidates                        |

---

## 🧪 Validation Rules

- ✅ **Unique Fields**: Email, Mobile, AadharCardNumber
- ✅ **Password Encryption**: Bcrypt with salt
- ✅ **Vote Restriction**: One vote per user (`isvoted: true`)
- ✅ **Role Validation**: Only `"admin"` can add/update/delete candidates
- ✅ **Age Check**: Must be 18+ to register and vote

---

## ⚙️ Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- Git CLI or GitHub Desktop
- Postman (for API testing)

---

## 🚀 Installation & Usage

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/vote-management-backend.git
cd vote-management-backend


Step 2: Install Dependencies

npm install

Step 3: Configure Environment Variables
Create a .env file in the root directory:

PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


Step 4: Start the Server

npm start

🔁 End-to-End Integration Steps
To test this project end-to-end:

Run MongoDB locally or with a free MongoDB Atlas cluster.

Start your backend server (npm start).

Use Postman or connect a frontend (like React or EJS) to:

Register and login users

Add and manage candidates (admin)

Cast a vote (voter)

Fetch real-time vote results

You can build your own frontend or connect it with my frontend repo (link here if available).


📦 Technologies Used
Node.js

Express.js

MongoDB & Mongoose

JWT (Authentication)

Bcrypt (Password Hashing)

Postman (API Testing)

🧑‍💻 Author
Made with ❤️ by Manan Kolate
🔗 https://in.linkedin.com/in/manan-kolate-14753b235
📧 manankolate@gmail.com

