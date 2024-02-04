import {Document, Schema,model} from 'mongoose';

interface Comment extends Document {
    idUser: string;
    idVideo: string;
    comment: string;
}

const userSchema = new Schema({
    idUser:  {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : true,
    },
    idVideo:  {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required : true,
    },
    comment:{
        type: String,
        required : true,
        trim: true
    }
}
);

export default model<Comment>('Comment', userSchema);