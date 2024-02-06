interface Video extends Document {
    titulo: string;
    descripcion: string;
    creditos: string;
    fechaPublicacion: Date;
    usuario: string;
    public: boolean; 
    urlVideo: string;
    likes: string[];
    idVideoCloudinary: string;
}

export default Video;