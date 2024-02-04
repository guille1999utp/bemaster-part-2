import {Document, Schema,model} from 'mongoose';

interface User extends Document {
    nombre: string;
    nickname: string;
    correo: string;
    password: string;
}

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