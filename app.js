import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ticketsRoutes from './routes/ticketRoutes.js'
import { connectDB } from './config/database.js';
import passport from 'passport';
import './middlewares/passport.js';
import session from 'express-session';
const app = express();
const PORT = process.env.PORT || 3001

// Connect to database
connectDB();

app.set('trust proxy', 1);
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.',
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use('/api/', limiter);




app.use(session({
    secret: 'your-secret-key',  // change to a strong secret
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true } // only if using HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketsRoutes);




app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});