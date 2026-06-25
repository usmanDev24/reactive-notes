import { redirect } from "react-router";
export async function allNotesLoader() {
  return getJson("/api/notes/all-notes")
}
export async function noteLoader({ params }) {
  return getJson("/api/notes/read/" + params.id)
}

export async function createAction({request, params}) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const note = await postJson("/api/notes/create", updates);
  return redirect(`/notes/${note.id}`);
}
export async function deleteAction({request, params}) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await postJson("/api/notes/destroy", updates);
  return redirect(`/notes`);
}

export async function getJson(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (networkError) {
    throw new Error(`Network failure: ${networkError.message}`, { cause: networkError });
  }
  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}: ${res.statusText}`, { cause: res.status });
  }
  const text = await res.text();
  if (!text || text.trim() === "") {
    return null; 
  }
  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error("Failed to parse response as JSON", { cause: parseError });
  }
}

export async function postJson(url : string , toPost : object) {
  let res;
  try {
    res = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toPost)
    });
  } catch (networkError) {
    throw new Error(`Network failure: ${networkError.message}`, { cause: networkError });
  }

  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}: ${res.statusText}`, { cause: res.status });
  }

  const text = await res.text();
  if (!text || text.trim() === "") {
    return null; 
  }
  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error("Failed to parse response as JSON", { cause: parseError });
  }
}


