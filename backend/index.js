import express from 'express';   
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import router from './routes/AuthRoute.js';
import router1 from './routes/AdminRoute.js';
import cors from 'cors';


dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();   

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', router);
app.use('/api/admin', router1);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
