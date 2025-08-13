# KAT Backend - Ticket Management System

A Node.js/Express backend API for a ticket management system with user authentication, Google OAuth integration, and role-based access control.

## Demo Video

🎥 **[Watch Demo Video Here](YOUR_LOOM_VIDEO_LINK_HERE)**

*Replace `YOUR_LOOM_VIDEO_LINK_HERE` with your actual Loom video link demonstrating the working application.*

## Features

- 🔐 **Authentication System**
  - Local authentication (email/password)
  - Google OAuth 2.0 integration
  - JWT token-based authorization
  - Session management

- 👥 **User Management**
  - User registration and login
  - Role-based access (admin/user)
  - Profile management
  - User CRUD operations

- 🎫 **Ticket Management**
  - Create, read, update, delete tickets
  - Assign tickets to users
  - Priority and status tracking
  - Role-based ticket visibility

- 🛡️ **Security Features**
  - Rate limiting
  - CORS configuration
  - Password hashing with bcrypt
  - JWT authentication middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Authorization**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Development**: nodemon

## Project Structure

```
Backend_Code/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── ticketController.js  # Ticket management logic
│   └── userController.js    # User management logic
├── middlewares/
│   ├── jwtAuth.js          # JWT authentication middleware
│   └── passport.js         # Passport Google OAuth strategy
├── modules/
│   ├── tickets.js          # Ticket MongoDB schema
│   └── user.js             # User MongoDB schema
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── ticketRoutes.js     # Ticket management routes
│   └── userRoutes.js       # User management routes
├── .env                    # Environment variables
├── app.js                  # Main application entry point
└── package.json           # Dependencies and scripts
```

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Cloud Console** project for OAuth setup

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gokul-backend-dev/Backend_Code.git
cd Backend_Code
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
CLIENT_URL=http://localhost:3000

# Server Port
PORT=3004
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3004/auth/google/callback`
7. Copy the **Client ID** and **Client Secret** to your `.env` file

### 5. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Running the Application

### Development Mode

```bash
npm start
```

The server will start on `http://localhost:3004` (or your specified PORT)

### Production Mode

```bash
node app.js
```

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiate Google OAuth login |
| GET | `/auth/google/callback` | Google OAuth callback |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | User login | No |
| GET | `/api/users/getUser` | Get current user profile | Yes |
| PUT | `/api/users/updateUser/:id` | Update user | Yes |
| POST | `/api/users/delete/:id` | Delete user | Yes |
| GET | `/api/users/getAll` | Get all users | Yes |
| POST | `/api/users/crateUserAdmin` | Create admin user | No |

### Ticket Routes (`/api/tickets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/tickets/createTicket` | Create new ticket | Yes |
| GET | `/api/tickets/getAll` | Get all tickets | Yes |
| PUT | `/api/tickets/update/:id` | Update ticket | Yes |
| DELETE | `/api/tickets/delete/:id` | Delete ticket | Yes |
| GET | `/api/tickets/dashboard` | Get dashboard data | Yes |

## Authentication Flow

### Google OAuth Flow

1. User clicks "Login with Google" → redirects to `/auth/google`
2. User authenticates with Google
3. Google redirects to `/auth/google/callback`
4. Backend generates JWT token
5. User redirected to frontend dashboard with token: `${CLIENT_URL}/dashboard?token=${accessToken}`

### JWT Authentication

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer your-jwt-token-here
```

## User Roles

- **Admin**: Can view and manage all tickets and users
- **User**: Can only view tickets assigned to them

## Database Models

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required for local auth),
  firstName: String,
  lastName: String,
  phone: String,
  role: String,
  avatar: String,
  googleId: String,
  githubId: String,
  providers: ['local', 'google', 'github'],
  isVerified: Boolean,
  isActive: Boolean,
  timestamps: true
}
```

### Ticket Model
```javascript
{
  title: String,
  description: String,
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  priority: String,
  status: ['open', 'inprogress', 'completed', 'reopen'],
  timestamps: true
}
```

## Error Handling

The API returns standardized error responses:

```javascript
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Cross-origin resource sharing enabled
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Express sessions for OAuth

## Development

### Adding New Routes

1. Create controller function in appropriate controller file
2. Add route in corresponding route file
3. Apply authentication middleware if needed

### Adding New Models

1. Create schema in `modules/` directory
2. Import and use in controllers
3. Update API documentation

## Troubleshooting

### Common Issues

**Google OAuth "redirect_uri_mismatch"**
- Ensure `http://localhost:3004/auth/google/callback` is added to Google Cloud Console
- Check that server is running on port 3004

**Database Connection Error**
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env` file

**JWT Token Issues**
- Verify `JWT_SECRET` is set in `.env`
- Check token format in Authorization header

**Port Already in Use**
- Change `PORT` in `.env` file
- Update Google OAuth callback URL accordingly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

---

**Author**: GokulNath R (Backend Developer)  
**Repository**: https://github.com/gokul-backend-dev/Backend_Code
