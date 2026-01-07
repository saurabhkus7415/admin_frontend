const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://0.0.0.0:5001';

export async function api(path:string, opts:RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: any = opts.headers ? {...opts.headers} : {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (res.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Unauthorized');
  }
  const text = await res.text();
  try { return JSON.parse(text); } catch(e) { return text; }
}
