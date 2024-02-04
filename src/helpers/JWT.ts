import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generarJwt = (uid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.JWT_clave as Secret, {
            expiresIn: '48h',
        }, (err: Error | null, token?: string) => {
            if (err) {
                console.log(err);
                reject('No se generó el JWT');
            } else {
                resolve(token as string);
            }
        });
    });
};

export const comprobacionJwt = (token: string = ''): [boolean, string | null] => {
    try {
        const payload = jwt.verify(token, process.env.JWT_clave as Secret) as JwtPayload;
        const uid = payload.uid as string;
        return [true, uid];
    } catch (error) {
        return [false, null];
    }
};