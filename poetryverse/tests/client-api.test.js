import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../client/src/api.js';

const originalFetch = globalThis.fetch;
after(() => { globalThis.fetch = originalFetch; });

test('client forwards session CSRF tokens to mutations and serializes JSON', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ user: null, csrfToken: 'synthetic-token' }), { status: 200 });
  await api('/auth/session');
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/poems');
    assert.equal(options.headers['X-CSRF-Token'], 'synthetic-token');
    assert.equal(options.credentials, 'same-origin');
    assert.deepEqual(JSON.parse(options.body), { title: 'Poem' });
    return new Response(JSON.stringify({ poem: { id: 'synthetic-id' } }), { status: 201 });
  };
  const response = await api('/poems', { method: 'POST', body: { title: 'Poem' } });
  assert.equal(response.poem.id, 'synthetic-id');
});
test('client rejects an HTML success response instead of passing invalid data to pages', async () => {
  globalThis.fetch = async () => new Response('<html>Unavailable</html>', { status: 200 });
  await assert.rejects(() => api('/poems'), /unexpected response/);
});
test('client preserves abort signals during both fetch and JSON decoding', async () => {
  const aborted = new DOMException('Request aborted', 'AbortError');
  globalThis.fetch = async () => { throw aborted; };
  await assert.rejects(() => api('/poems'), error => error === aborted);
  globalThis.fetch = async () => ({ ok: true, json: async () => { throw aborted; } });
  await assert.rejects(() => api('/poems'), error => error === aborted);
});
test('client exposes server validation messages and status codes', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'Please log in to continue.' }), { status: 401 });
  await assert.rejects(() => api('/poems'), error => error.status === 401 && error.message === 'Please log in to continue.');
});
