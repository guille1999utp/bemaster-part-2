import { Request, Response } from 'express';
import Video from '../models/video';
import Comment from '../models/comment';
import cloudinary from '../utils/cloudinary';
import { tokenRequest } from '../interfaces/jwt';
import { UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import User from '../models/user';
import { comprobacionJwt } from '../helpers/JWT';

// Crear un video
export const createVideo = async (req: tokenRequest, res: Response): Promise<void> => {
    try {
        const { titulo, descripcion, creditos, public: isPublic } = req.body;

        const userId = req.uid;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
            return;
        } 

        if (!req.file) {
            res.status(400).json({ ok: false, message: 'No se proporcionó un archivo de video' });
            return;
        }

        const cloudinaryUploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'video', folder: 'videos' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error('Cloudinary upload result is undefined.'));
                        }
                    }
                }
            );
            
            if (req.file.buffer) {
                const bufferStream = new Readable();
                bufferStream.push(req.file.buffer);
                bufferStream.push(null);
                
                bufferStream.pipe(uploadStream);
            } else {
                reject(new Error('Buffer not available in req.file.'));
            }
        });

        const newVideo = new Video({
            titulo,
            descripcion,
            creditos,
            usuario: userId,
            urlVideo: cloudinaryUploadResponse.secure_url,
            idVideoCloudinary: cloudinaryUploadResponse.public_id,
            public: isPublic,
        });

        await newVideo.save();

        res.json({ ok: true, message: 'Video creado exitosamente', video: newVideo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al crear el video' });
    }
};

// Actualizar un video existente
export const updateVideo = async (req: tokenRequest, res: Response): Promise<void> => {
    try {
        const videoId = req.params.id;

        const existingVideo = await Video.findById(videoId);

        if (!existingVideo) {
            res.status(404).json({ ok: false, message: 'Video no encontrado' });
            return;
        }

        const userId = req.uid;

        if (existingVideo.usuario.toString() !== userId) {
            res.status(403).json({ ok: false, message: 'No tienes permisos para actualizar este video' });
            return;
        }

        existingVideo.titulo = req.body.titulo;
        existingVideo.descripcion = req.body.descripcion;
        existingVideo.creditos = req.body.creditos;
        existingVideo.public = req.body.public;

        await existingVideo.save();

        res.json({ ok: true, message: 'Video actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al actualizar el video' });
    }
};

// Eliminar un video
export const deleteVideo = async (req: tokenRequest, res: Response): Promise<void> => {
    try {
        const videoId = req.params.id;

        const userId = req.uid;

        if (!userId) {
            res.status(401).json({ ok: false, message: 'Token no válido' });
            return;
        }

        const video = await Video.findOne({ _id: videoId, usuario: userId });

        if (!video) {
            res.status(404).json({ ok: false, message: 'Video no encontrado o no autorizado para eliminarlo' });
            return;
        }

        await cloudinary.api.delete_resources([video.idVideoCloudinary], { type: 'upload', resource_type: 'video' });

        await Video.findByIdAndDelete(videoId);

        await Comment.deleteMany({ idVideo: videoId });

        res.json({ ok: true, message: 'Video eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al eliminar el video' });
    }
};

// Obtener videos de un usuario por su nickname
export const videosByUserPublic = async (req: tokenRequest, res: Response): Promise<void> => {
    try {
        const { nickname } = req.params;

        const user = await User.findOne({ nickname });

        if (!user) {
            res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
            return;
        }

        const videos = await Video.find({ usuario: user._id, public: true });
        res.json({ ok: true, videos });
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener videos del usuario' });
    }
};

// Obtener video por id
export const getVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        const videoId = req.params.id;
        const existingVideo = await Video.findById(videoId);
        const jwt = comprobacionJwt(req.header('x-token') || '');
        const userId = jwt[1];
        if (existingVideo?.public || (existingVideo?.usuario.toString() === userId)) {
            const video = await Video.findById(videoId);
            const comments = await Comment.find({ idVideo: videoId });
    
            res.json({ ok: true, video, comments });
            return;
        } else {
            res.status(403).json({ ok: false, message: 'No tienes permiso para comentar en este video' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener videos mejor calificados' });
    }
};

// Obtener los videos mejor calificados y públicos
export const videosTopRate = async (req: Request, res: Response): Promise<void> => {
    try {
        const topRatedVideos = await Video.find({ public: true }).sort({ likes: -1 }).limit(10);

        res.json({ ok: true, message: 'Videos mejor calificados obtenidos exitosamente', videos: topRatedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener videos mejor calificados' });
    }
};

// Obtener videos privados de un usuario por su nickname
export const videosByUserPrivate = async (req: tokenRequest, res: Response): Promise<void> => {
    try {
        const userId = req.uid;
        const { nickname } = req.params;

        const user = await User.findOne({ nickname });

        if (!user) {
            res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
            return;
        }
        if (user._id.toString() !== userId) {
        const videos = await Video.find({ usuario: user._id, public: false });
        res.json({ ok: true, message: 'Videos privados obtenidos exitosamente', videos });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al obtener videos del usuario' });
    }
};

// Dar like a un video
export const likeVideo = async (req: tokenRequest, res: Response): Promise<void> => {
    try {
        const videoId = req.params.id;
        const userId = req.uid as string;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
            return;
        } 

        const existingVideo = await Video.findById(videoId);

        if (!existingVideo) {
            res.status(404).json({ ok: false, message: 'Video no encontrado' });
            return;
        }

        if (existingVideo.public || (existingVideo.usuario.toString() === userId)) {
            if (existingVideo.likes.includes(userId)) {
                res.status(400).json({ ok: false, message: 'Ya has dado like a este video' });
                return;
            }
    
            existingVideo.likes.push(userId);
    
            await existingVideo.save();
    
            res.json({ ok: true, message: 'Like agregado exitosamente', likes: existingVideo.likes });
            return;
        } else {
            res.status(403).json({ ok: false, message: 'No tienes permiso para comentar en este video' });
        }
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al dar like al video' });
    }
};

// Comentar en un video
export const commentVideo = async (req: tokenRequest, res: Response): Promise<void> => {
    try {
        const videoId = req.params.id;
        const userId = req.uid;

        if (!userId) {
            res.status(401).json({ ok: false, message: 'Token no válido' });
            return;
        }

        const existingVideo = await Video.findById(videoId);

        if (!existingVideo) {
            res.status(404).json({ ok: false, message: 'Video no encontrado' });
            return;
        }

        if (existingVideo.public || (existingVideo.usuario.toString() === userId)) {
            const newComment = new Comment({
                idUser: userId,
                idVideo: videoId,
                comment: req.body.comentario,
            });

            await newComment.save();

            res.json({ ok: true, message: 'Comentario agregado exitosamente', comment: newComment });
        } else {
            res.status(403).json({ ok: false, message: 'No tienes permiso para comentar en este video' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error al comentar en el video' });
    }
};
