const BASE = 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('kuisine_token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Token ${getToken()}` } : {}),
  ...extra,
});

const request = async (method, path, body = null) => {
  const opts = { method, headers: headers() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

// ── AUTH ──────────────────────────────────────────────────────
export const apiRegister = (body)  => request('POST', '/auth/register/', body);
export const apiLogin    = (body)  => request('POST', '/auth/login/',    body);
export const apiLogout   = ()      => request('POST', '/auth/logout/');
export const apiMe       = ()      => request('GET',  '/auth/me/');

// ── FOOD COURTS ───────────────────────────────────────────────
export const apiFoodCourts      = ()      => request('GET',   '/food-courts/');
export const apiFoodCourtDetail = (id)    => request('GET',   `/food-courts/${id}/`);
export const apiFoodCourtPatch  = (id, b) => request('PATCH', `/food-courts/${id}/`, b);

// ── MENU ──────────────────────────────────────────────────────
export const apiMenu = (params = '') => request('GET', `/menu/${params}`);

// ── ORDERS ────────────────────────────────────────────────────
export const apiPlaceOrder       = (body)     => request('POST',  '/orders/',              body);
export const apiOrders           = (params='') => request('GET',  `/orders/${params}`);
export const apiOrderDetail      = (id)        => request('GET',  `/orders/${id}/`);
export const apiUpdateOrderStatus = (id, body) => request('PATCH', `/orders/${id}/status/`, body);

// ── STATS ─────────────────────────────────────────────────────
export const apiStats = () => request('GET', '/stats/');
