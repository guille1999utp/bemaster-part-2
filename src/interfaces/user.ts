import { Document } from "mongoose";

interface User extends Document {
    nombre: string;
    nickname: string;
    correo: string;
    password: string;
}

export default User;