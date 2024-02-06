import { Schema, model, Document } from 'mongoose';
import Video from '../interfaces/video';

const videoSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
    },
    creditos: {
        type: String,
        required: true,
        trim: true,
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    urlVideo: {
        type: String,
        required: true,
        trim: true,
    },
    idVideoCloudinary: {
        type: String,
        required: true,
        trim: true,
    },
    public: {
        type: Boolean,
        default: true, 
    },
    likes: {
        type: [Schema.Types.ObjectId],
        default: [], 
    }
});

export default model<Video>('Video', videoSchema);
