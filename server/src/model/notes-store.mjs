import { prisma } from "./prisma.mjs";
const DB = prisma.notes
export class NotesStore {
  async create(title, body) {
    const note = await prisma.notes.create({
      data: {
        title: title,
        body: body
      }
    })
    return note
  }
  async destroy(id) {
    try {
      await prisma.notes.delete({ where: { id } })
      return true
    } catch (error) {
      return null
    }
  }
  async readAll() {
    const notes = await prisma.notes.findMany();
    return notes
  }
  async read(id) {
    const note = await prisma.notes.findUnique({
      where: {
        id: Number(id)
      }
    });
    return note
  }
  async update(id, title, body) {
    const note = await prisma.notes.update({
      where: {id: id}, 
      data: {
        title: title,
        body: body
      }
    })
    return note
  }
}