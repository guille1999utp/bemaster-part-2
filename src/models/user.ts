import {Document, Schema,model} from 'mongoose';
import User from '../interfaces/user';



const userSchema = new Schema({
    nombre:  {
        type: String,
        required : true,
        trim: true,
    },
    nickname:  {
        type: String,
        required : true,
        trim: true,
    },
    correo:{
        type: String,
        required : true,
        unique: true,
        trim: true
    },
    password:{
       type: String,
       required : true,

    }
}
);

export default model<User>('User', userSchema);