let csrfToken = '';

export async function api(path, { method = 'GET', body, ...options } = {}) {
  const response = await fetch(`/api${path}`, {
    ...options, method, credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(method !== 'GET' ? { 'X-CSRF-Token': csrfToken } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  let data;
  try { data = await response.json(); }
  catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('The server returned an unexpected response. Please try again.');
  }
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong. Please try again.');
    error.status = response.status;
    throw error;
  }
  if (data.csrfToken) csrfToken = data.csrfToken;
  return data;
}
