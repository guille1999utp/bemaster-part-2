import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name:process.env.CLAUD_NAME , 
  api_key: process.env.API_KEY_CLAUDINARY, 
  api_secret: process.env.API_SECRET_CLAUDINARY
});

export default cloudinary;