import { Router } from "express";
import { NotesStore } from "../model/notes-store.mjs";
import { escape } from "node:querystring";

export const router =  Router();

const store = new NotesStore();

router.post("/save", async (req, res, next) => {
  const note = await  store.create(req.body.title, req.body.noteBody)
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
  const note = await store.read( Number(req.params.id) );
  res.json(note)
})

router.delete("/destroy/:noteId", async (req, res) => {
  const deleted = await store.destroy(req.params.noteId);
  if (deleted)
    res.send(true)
  else 
    res.status(500).send(null)
})
