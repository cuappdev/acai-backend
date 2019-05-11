const PORT: number = +process.env.PORT || 5000;

const del = (path: string, token?: string) => ({
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
  uri: `http://localhost:${PORT}/api/v1${path}`,
  json: true,
});

const get = (path: string, token?: string) => ({
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
  uri: `http://localhost:${PORT}/api/v1${path}`,
  json: true,
});

const post = (path: string, body: object, token?: string) => ({
  body,
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  url: `http://localhost:${PORT}/api/v1${path}`,
  json: true,
});

const put = (path: string, body: object, token?: string) => ({
  body,
  method: 'PUT',
  headers: { Authorization: `Bearer ${token}` },
  uri: `http://localhost:${PORT}/api/v1${path}`,
  json: true,
});

export type APIResponse = {
  success: boolean,
  errors?: [string],
  data?: any,
};

export { del, get, post, put };
