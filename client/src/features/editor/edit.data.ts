import { redirect } from "react-router";
import { postJson } from "../notes/notes.data";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await postJson("/api/notes/update", updates);
  return redirect(`/notes/`+updates['id']);
}