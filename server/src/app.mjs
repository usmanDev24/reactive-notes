import express from 'express';
import { default as cors } from 'cors';
import  { default as cookieParser} from 'cookie-parser';
import { default as logger } from 'morgan';
import { router as notesRouter} from './routes/notes.mjs'
import { log } from 'node:console';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000
export const rootDir =  path.dirname(fileURLToPath(import.meta.url))
console.log(rootDir)
export  const  APP = express();

APP.use(logger("dev"))
APP.use(cors());
APP.use(express.json())
APP.use(express.urlencoded({extended: true}))

APP.use(cookieParser());
APP.use("/notes", notesRouter)

APP.use(express.static(path.join(rootDir , "public")))



