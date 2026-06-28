import express, { Router } from 'express';
import { default as cors } from 'cors';
import  { default as cookieParser} from 'cookie-parser';
import { default as logger } from 'morgan';
import { router as notesRouter} from './routes/notes.mjs'
import { router as authRouter } from './routes/auth.mjs';
import { AppError, globalErrorHandler } from './app-support.mjs';
import passport from 'passport';
const apiRouter = Router();

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000
export const rootDir =  path.dirname(fileURLToPath(import.meta.url))
console.log(rootDir)
export  const  app = express();

app.use(logger("dev"))
app.use(cors());
app.use(express.json({type: "application/json"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

apiRouter.use(passport.initialize())
apiRouter.use("/api/v1/notes", notesRouter)
apiRouter.use("/api/v1/auth", authRouter)

app.use(apiRouter)
app.use(express.static(path.join(rootDir , "public")))

app.use((req, res, next) => {
  try {
    next(new AppError("NOT FOUND", 404, 404))
  } catch (error) {
    next(error)
  }
  
})
app.use(globalErrorHandler)


