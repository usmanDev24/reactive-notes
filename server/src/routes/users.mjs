import { Router } from "express";
import { ensureAuthenticated } from "./auth.mjs";
import UserStore from "../model/user-store.mjs";

const userStore = new UserStore()
export const router = Router();

router.get('/me',  async (req, res, next) => {
  const user = await userStore.read(req.user.id)
  res.json(user)
})