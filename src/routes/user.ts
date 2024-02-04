import {Router} from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate';
import { login, register,deleteUser, updateUserName, getUserByNickname } from '../controllers/user';
import { validarJwt } from '../helpers/generateJWT';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados con usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nombre:
 *           type: string
 *         nickname:
 *           type: string
 *         correo:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       required:
 *         - _id
 *         - nombre
 *         - nickname
 *         - correo
 *         - password
 */
const router = Router();
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - correo
 *               - password
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 usuarioBd:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 */
router.post('/login', [
    check('correo','El "email" es obligatorio').notEmpty(),
    check('password','El "password" es obligatorio').notEmpty(),
    validateFields
],login);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 newUser:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 */
router.post('/register', [
    check('nombre','El campo "nombre" es obligatorio').notEmpty(),
    check('nickname','El campo "nickname" es obligatorio').notEmpty(),
    check('correo','El campo "correo" es obligatorio').notEmpty(),
    check('correo','El campo "correo" debe ser un correo').isEmail(),
    check('password','El campo "password" es obligatorio').notEmpty(),
    validateFields
],register);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-token
 *         required: true
 *         description: Token de autenticación
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Usuario eliminado correctamente
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
router.delete('/user/:id',validarJwt, deleteUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Actualiza el nombre de un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario que se actualizará
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
 *               nombre:
 *                 type: string
 *             required:
 *               - nombre
 *     responses:
 *       '200':
 *         description: Nombre del usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.put('/user/:id', [
    validarJwt,
    check('nombre', 'El campo "nombre" es obligatorio').notEmpty(),
    validateFields
], updateUserName);

/**
 * @swagger
 * /user/nickname/{nickname}:
 *   get:
 *     summary: Obtiene información de un usuario por su nickname
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         description: Nickname del usuario a buscar
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     correo:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     nickname:
 *                       type: string
 *       '404':
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 */
router.get('/user/nickname/:nickname', getUserByNickname);


export default router;