import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import db from './models/index.js';
dotenv.config();

//Importing Routes
import registrationRouter from './Router/registrationRoutes.js';
import authRouter from './Router/authRoutes.js';

const app = express();
const server = createServer(app);
dotenv.config();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3700',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
}));





//Routes for the member ship registration
app.use('/api/registrations', registrationRouter)
app.use('/api/auth', authRouter)
app.get('/', (req, res)=>{
  res.send('Welcome to the API!');
});

// Health Check Route 
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});



// Start the server

server.listen(PORT, async() => {
try {
    await db.sequelize.authenticate();
        // await db.sequelize.sync({ force: true });

    console.log('Database connected successfully.');
    console.log(`Server is running on http://localhost:${PORT}`);

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
