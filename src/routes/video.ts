import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate';
import {
    createVideo,
    updateVideo,
    deleteVideo,
    videosByUserPublic,
    likeVideo,
    commentVideo,
    videosByUserPrivate,
    videosTopRate,
    getVideo
} from '../controllers/video';
import { validarJwt } from '../helpers/generateJWT';
import upload from '../middlewares/video';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Endpoints relacionados con videos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         titulo:
 *           type: string
 *         descripcion:
 *           type: string
 *         creditos:
 *           type: string
 *         usuario:
 *           type: string
 *         urlVideo:
 *           type: string
 *         idVideoCloudinary:
 *           type: string
 *         public:
 *           type: boolean
 *         fechaPublicacion:
 *           type: string
 *         __v:
 *           type: integer
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - _id
 *         - titulo
 *         - descripcion
 *         - creditos
 *         - usuario
 *         - urlVideo
 *         - idVideoCloudinary
 *         - public
 *         - fechaPublicacion
 *         - likes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         idUser:
 *           type: string
 *         idVideo:
 *           type: string
 *         comment:
 *           type: string
 *       required:
 *         - _id
 *         - idUser
 *         - idVideo
 *         - comment
 */

/**
 * @swagger
 * /video/create:
 *   post:
 *     summary: Crea un nuevo video
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-token
 *         required: true
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               public:
 *                 type: boolean
 *               creditos:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Video creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 video:
 *                   type: object
 *                   $ref: '#/components/schemas/Video'
 *                 msg:
 *                   type: string
 */
router.post('/video/create', [
    validarJwt,
    upload.single('video'),
    check('titulo', 'El campo "titulo" es obligatorio').notEmpty(),
    check('descripcion', 'El campo "descripcion" es obligatorio').notEmpty(),
    check('public', 'El campo "public" es obligatorio').notEmpty(),
    check('creditos', 'El campo "creditos" es obligatorio').notEmpty(),
    validateFields
], createVideo);

/**
 * @swagger
 * /video/like/{id}:
 *   post:
 *     summary: Dar like a un video
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del video al que se dará like
 *       - in: header
 *         name: x-token
 *         required: true
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Like agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 */
router.post('/video/like/:id', [
    validarJwt
], likeVideo);

/**
 * @swagger
 * /video/comment/{id}:
 *   post:
 *     summary: Comentar en un video
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del video en el que se comentará
 *       - in: header
 *         name: x-token
 *         required: true
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *             required:
 *               - comentario
 *     responses:
 *       '200':
 *         description: Comentario agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 */
router.post('/video/comment/:id', [
    validarJwt,
    check('comentario', 'El campo "comentario" es obligatorio').notEmpty(),
    validateFields
], commentVideo);

/**
 * @swagger
 * /video/{id}:
 *   delete:
 *     summary: Elimina un video
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del video a eliminar
 *       - in: header
 *         name: x-token
 *         required: true
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Video eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 */
router.delete('/video/:id', validarJwt, deleteVideo);

/**
 * @swagger
 * /video/{id}:
 *   put:
 *     summary: Actualiza la información de un video
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del video que se actualizará
 *       - in: header
 *         name: x-token
 *         required: true
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               public:
 *                 type: boolean
 *               creditos:
 *                 type: string
 *             required:
 *               - titulo
 *               - descripcion
 *               - public
 *               - creditos
 *     responses:
 *       '200':
 *         description: Video actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 video:
 *                   type: object
 *                   $ref: '#/components/schemas/Video'
 */
router.put('/video/:id', [
    validarJwt,
    check('titulo', 'El campo "titulo" es obligatorio').notEmpty(),
    check('descripcion', 'El campo "descripcion" es obligatorio').notEmpty(),
    check('public', 'El campo "public" es obligatorio').notEmpty(),
    check('creditos', 'El campo "creditos" es obligatorio').notEmpty(),
    validateFields
], updateVideo);

/**
 * @swagger
 * /video/nickname/{nickname}/public:
 *   get:
 *     summary: Obtiene videos públicos de un usuario por su nickname
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         description: Nickname del usuario cuyos videos se obtendrán
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Videos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 */
router.get('/video/nickname/:nickname/public', videosByUserPublic);

/**
 * @swagger
 * /video/nickname/{nickname}:
 *   get:
 *     summary: Obtiene todos los videos privados de un usuario por su nickname 
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         description: Nickname del usuario cuyos videos se obtendrán
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-token
 *         required: true
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Videos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 */
router.get('/video/nickname/:nickname', validarJwt, videosByUserPrivate);

/**
 * @swagger
 * /video/top-rate:
 *   get:
 *     summary: Obtiene los videos mejor calificados
 *     tags: [Videos]
 *     responses:
 *       '200':
 *         description: Videos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 */
router.get('/video/top-rate', videosTopRate);

/**
 * @swagger
 * /video/{id}:
 *   get:
 *     summary: Obtiene toda la informacion del video por su id
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del video a obtener
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-token
 *         required: false
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Video obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 video:
 *                   type: object
 *                   $ref: '#/components/schemas/Video'
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */
router.get('/video/:id', getVideo);

export default router;
