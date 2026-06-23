export async  function allNotesLoader() {
  return  getReq('/api/notes/all-notes');
}
export async function noteLoader({params}) {
  return  getReq('/api/notes/read/' +params.id)
}
export async function getReq(url : string) {
  try {
    const res = await fetch(url);
    if (res.status === 200 || res.status === 304) {
      const text = await res.text();
  
      return JSON.parse(text)
    } else throw new Error(res.statusText)
  } catch (error) {
    console.error(error)
    throw error
  } 
}