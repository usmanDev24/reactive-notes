import { Router } from "express";
import { NotesStore } from "../model/notes-store.mjs";
import { escape } from "node:querystring";

export const router =  Router();

const store = new NotesStore();

router.post("/create", async (req, res, next) => {
  const note = await  store.create(req.body.title, req.body.noteBody)
  if (note)
    res.json(note)
  else 
    res.status(500).send("Interal Sever Error")
})
router.post("/update", async (req, res, next) => {
  const note = await  store.update( req.body.id, req.body.title, req.body.noteBody)
  if (note)
    res.json(note)
  else 
    res.status(500).send("Interal Sever Error")
})
router.get("/all-notes", async (req, res, next) => {
  const notes = await store.readAll();
  res.json(notes)
})

router.get("/read/:id", async (req, res, next) => {
  const note = await store.read(req.params.id);
  res.json(note)
})

router.post("/destroy", async (req, res) => {
  const deleted = await store.destroy(req.body.id);
  if (deleted)
    res.json({deleted: true})
  else 
    res.status(500).send(null)
})
