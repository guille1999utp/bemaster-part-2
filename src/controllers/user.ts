import { Request, Response } from "express";
import User from "../models/user";
import bcryptjs from 'bcryptjs';
import { generarJwt } from "../helpers/JWT";
import { tokenRequest } from "../interfaces/jwt";

export const register = async (req: Request, res: Response) => {
    try {
        const { correo, password, nickname } = req.body;

        const existingUser = await User.findOne({ $or: [{ correo }, { nickname }] });

        if (existingUser) {
            const existingField = existingUser.correo === correo ? 'correo' : 'nickname';

            return res.status(400).json({
                ok: false,
                msg: `El ${existingField} ya existe`,
            });
        }

        const newUser = new User(req.body);
        const salt = bcryptjs.genSaltSync();
        newUser.password = bcryptjs.hashSync(password, salt);
        await newUser.save();

        const token = await generarJwt(newUser.id);

        res.json({
            ok: true,
            newUser,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo fallas en la base de datos',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { correo, password } = req.body;
    try {
        const usuarioBd = await User.findOne({
            $or: [{ correo }, { nickname: correo }],
        });

        if (!usuarioBd) {
            return res.status(404).json({
                ok: false,
                msg: 'email o nickname no existe',
            });
        }

        const validarcontraseña = bcryptjs.compareSync(password, usuarioBd.password);

        if (!validarcontraseña) {
            return res.status(404).json({
                ok: false,
                msg: 'contraseña incorrecta',
            });
        }

        const token = await generarJwt(usuarioBd.id);

        return res.json({
            ok: true,
            usuarioBd,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hubo fallas en la base de datos'
        });
    }
};

export const deleteUser = async (req: tokenRequest, res: Response) => {
    const userId = req.params.id;

    try {

        if (req.uid !== userId) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permiso para eliminar este usuario',
            });
        }

        // Buscar el usuario por su ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Eliminar el usuario
        await User.findByIdAndDelete(userId);

        res.json({
            ok: true,
            msg: 'Usuario eliminado correctamente',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error en la base de datos',
        });
    }
};

export const updateUserName = async (req: tokenRequest, res: Response) => {
    const userId = req.params.id;
    const { nombre } = req.body;

    try {

        if (req.uid !== userId) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permiso para actualizar este usuario',
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        user.nombre = nombre;
        await user.save();

        res.json({
            ok: true,
            msg: 'Nombre del usuario actualizado correctamente',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error en la base de datos',
        });
    }
};

export const getUserByNickname = async (req: Request, res: Response) => {
    try {
        const nickname = req.params.nickname;

        // Buscar usuario por nickname
        const user = await User.findOne({ nickname });

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Retornar información del usuario
        const { correo, nombre, nickname: userNickname } = user;
        res.json({
            ok: true,
            usuario: {
                correo,
                nombre,
                nickname: userNickname,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error en la base de datos',
        });
    }
};
