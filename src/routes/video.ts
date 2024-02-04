import {Router} from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate';
import { createVideo, updateVideo,deleteVideo,videosByUserPublic,likeVideo,commentVideo,videosByUserPrivate, videosTopRate,getVideo } from '../controllers/video';
import { validarJwt } from '../helpers/generateJWT';
import upload from '../middlewares/video';

const router = Router();

router.post('/video/create', [
    validarJwt,
    upload.single('video'),
    check('titulo', 'El campo "titulo" es obligatorio').notEmpty(),
    check('descripcion', 'El campo "descripcion" es obligatorio').notEmpty(),
    check('public', 'El campo "public" es obligatorio').notEmpty(),
    check('creditos', 'El campo "creditos" es obligatorio').notEmpty(),
    validateFields
],createVideo);


router.post('/video/like/:id', [
    validarJwt
],likeVideo);

router.post('/video/comment/:id', [
    validarJwt,
    check('comentario','El campo "comentario" es obligatorio').notEmpty(),
    validateFields
],commentVideo);

router.delete('/video/:id',validarJwt, deleteVideo);

router.put('/video/:id', [
    validarJwt,
    check('titulo', 'El campo "titulo" es obligatorio').notEmpty(),
    check('descripcion', 'El campo "descripcion" es obligatorio').notEmpty(),
    check('public', 'El campo "public" es obligatorio').notEmpty(),
    check('creditos', 'El campo "creditos" es obligatorio').notEmpty(),
    validateFields
], updateVideo);

router.get('/video/nickname/:nickname/public', videosByUserPublic);

router.get('/video/nickname/:nickname', validarJwt, videosByUserPrivate);

router.get('/video/top-rate', videosTopRate);

router.get('/video/:id', getVideo);

export default router;