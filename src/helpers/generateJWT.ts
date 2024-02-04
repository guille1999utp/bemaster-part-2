import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface RequestValidate extends Request {
    uid?: string; // Agregamos la propiedad uid opcional al tipo Request
}

export const validarJwt = (req: RequestValidate, res: Response, next: NextFunction) => {
    
    try {
        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token disponible',
            });
        }

        const payload = jwt.verify(token, process.env.JWT_clave as Secret) as JwtPayload;
        const uid: string = payload.uid as string;

        req.uid = uid;
        next();
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no permitido',
        });
    }
};
