const KEY = 'accessToken';
export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t) => localStorage.setItem(KEY, t);
export const removeToken = () => localStorage.removeItem(KEY);
export const isTokenValid = () => {
 const token = getToken();
 if (!token) return false;
 try {
 const payload = JSON.parse(atob(token.split('.')[1]));
 return payload.exp * 1000 > Date.now();
 } catch { removeToken(); return false; }
};