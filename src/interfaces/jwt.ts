import { Request } from "express";
import { Multer } from 'multer';


export interface tokenRequest extends Request {
  uid?: string;
  file?: Multer.File;
}