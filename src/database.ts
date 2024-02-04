import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_CNN as string);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('DB está conectada');
});