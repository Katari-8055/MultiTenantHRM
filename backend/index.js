import express from 'express';   
import dotenv from 'dotenv';
import morgan from 'morgan';
import router from './routes/AuthRoute.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();   

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
