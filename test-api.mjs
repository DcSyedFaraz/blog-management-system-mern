import fetch from 'node:http';
import { request as httpreq } from 'node:http';

const BASE = 'http://localhost:5000/api';

async function req(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    const r = httpreq(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    r.on('error', (e) => resolve({ status: 0, body: { error: e.message } }));
    if (data) r.write(data);
    r.end();
  });
}

const pass = (label, ok, detail = '') => {
  const icon = ok ? '✅' : '❌';
  console.log(`${icon} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) process.exitCode = 1;
};

console.log('\n=== BLOG MANAGEMENT SYSTEM — API TEST SUITE ===\n');

// ── AUTH ──────────────────────────────────────────────────────────
console.log('── Authentication ──');

// Register admin
let r = await req('POST', '/auth/register', { name: 'Test Admin', email: 'testadmin@x.com', password: 'secret123', role: 'admin' });
pass('Register admin', r.status === 201 && r.body.user?.role === 'admin', `role=${r.body.user?.role}`);
const adminToken = r.body.accessToken;
const adminRefresh = r.body.refreshToken;

// Register author
r = await req('POST', '/auth/register', { name: 'Test Author', email: 'testauthor@x.com', password: 'secret123', role: 'author' });
pass('Register author', r.status === 201 && r.body.user?.role === 'author', `role=${r.body.user?.role}`);
const authorToken = r.body.accessToken;

// Duplicate email
r = await req('POST', '/auth/register', { name: 'Dup', email: 'testadmin@x.com', password: 'secret123' });
pass('Duplicate email rejected', r.status === 409, `status=${r.status}`);

// Login
r = await req('POST', '/auth/login', { email: 'testauthor@x.com', password: 'secret123' });
pass('Login returns tokens', r.status === 200 && !!r.body.accessToken, `has accessToken=${!!r.body.accessToken}`);

// Wrong password
r = await req('POST', '/auth/login', { email: 'testauthor@x.com', password: 'wrongpass' });
pass('Wrong password rejected (401)', r.status === 401, `status=${r.status}`);

// Validation — short name + bad email + short password
r = await req('POST', '/auth/register', { name: 'x', email: 'notemail', password: '12' });
pass('Joi validation errors returned', r.status === 400 && r.body.errors?.length >= 3, `errors=${r.body.errors?.length}`);

// Refresh token
r = await req('POST', '/auth/refresh', { refreshToken: adminRefresh });
pass('Refresh token returns new accessToken', r.status === 200 && !!r.body.accessToken, `has newToken=${!!r.body.accessToken}`);
const freshAdminToken = r.body.accessToken;

console.log('');
console.log('── Posts ──');

// Create published post as author
r = await req('POST', '/posts', { title: 'Published Post Title', content: 'This is detailed content for the published post.', tags: ['react', 'js'], status: 'published' }, authorToken);
pass('Author creates published post', r.status === 201 && r.body.status === 'published', `status=${r.body.status}`);
const postId = r.body._id;

// Create draft post as author
r = await req('POST', '/posts', { title: 'My Draft Post', content: 'Draft content that should not be public.', tags: ['draft'], status: 'draft' }, authorToken);
pass('Author creates draft post', r.status === 201 && r.body.status === 'draft', `status=${r.body.status}`);
const draftId = r.body._id;

// Create second published post
r = await req('POST', '/posts', { title: 'Second Published Post', content: 'Another published post with different content here.', tags: ['nodejs'], status: 'published' }, authorToken);
pass('Author creates second published post', r.status === 201, `id=${r.body._id}`);

// Public posts — only published
r = await req('GET', '/posts');
pass('Public GET /posts returns only published', r.status === 200 && r.body.posts?.every(p => p.status === 'published'), `total=${r.body.pagination?.totalPosts}`);

// My posts — draft + published
r = await req('GET', '/posts/user/my', null, authorToken);
pass('GET /posts/user/my returns draft + published', r.status === 200 && r.body.pagination?.totalPosts === 3, `myTotal=${r.body.pagination?.totalPosts}`);

// Unauthenticated cannot create
r = await req('POST', '/posts', { title: 'Hack', content: 'Unauthorized attempt here', status: 'published' });
pass('Unauthenticated cannot create post (401)', r.status === 401, `status=${r.status}`);

// Search
r = await req('GET', '/posts?search=Published');
pass('Search by title works', r.status === 200, `found=${r.body.pagination?.totalPosts}`);

// Pagination
r = await req('GET', '/posts?page=1&limit=1');
pass('Pagination works (limit=1)', r.status === 200 && r.body.posts?.length === 1 && !!r.body.pagination?.hasNext, `hasNext=${r.body.pagination?.hasNext}`);

// Get single post
r = await req('GET', `/posts/${postId}`);
pass('GET /posts/:id returns post', r.status === 200 && r.body._id === postId, `title=${r.body.title}`);

// Update post — owner
r = await req('PUT', `/posts/${postId}`, { title: 'Published Post Title (Edited)' }, authorToken);
pass('Author edits own post', r.status === 200 && r.body.title.includes('Edited'), `title=${r.body.title}`);

// Update post — admin edits any post
r = await req('PUT', `/posts/${draftId}`, { title: 'Draft Edited by Admin' }, freshAdminToken);
pass('Admin edits any post', r.status === 200 && r.body.title.includes('Admin'), `title=${r.body.title}`);

// PATCH status
r = await req('PATCH', `/posts/${postId}/status`, { status: 'draft' }, authorToken);
pass('PATCH status: published → draft', r.status === 200 && r.body.status === 'draft', `newStatus=${r.body.status}`);
r = await req('PATCH', `/posts/${postId}/status`, { status: 'published' }, authorToken);
pass('PATCH status: draft → published', r.status === 200 && r.body.status === 'published', `newStatus=${r.body.status}`);

// Admin all posts
r = await req('GET', '/posts/admin/all', null, freshAdminToken);
pass('Admin GET /posts/admin/all sees all posts', r.status === 200 && r.body.pagination?.totalPosts === 3, `adminTotal=${r.body.pagination?.totalPosts}`);

// Author cannot access admin route
r = await req('GET', '/posts/admin/all', null, authorToken);
pass('Author blocked from /posts/admin/all (403)', r.status === 403, `status=${r.status}`);

console.log('');
console.log('── Comments ──');

r = await req('POST', `/posts/${postId}/comments`, { content: 'Great article!' }, adminToken);
pass('Authenticated user can comment', r.status === 201 && r.body.content === 'Great article!', `author=${r.body.author?.name}`);

r = await req('POST', `/posts/${postId}/comments`, { content: 'I agree!' }, authorToken);
pass('Author can also comment', r.status === 201, `content=${r.body.content}`);

r = await req('GET', `/posts/${postId}/comments`);
pass('GET comments returns array', r.status === 200 && r.body.length === 2, `count=${r.body.length}`);

r = await req('POST', `/posts/${postId}/comments`, { content: 'No auth comment' });
pass('Unauthenticated comment blocked (401)', r.status === 401, `status=${r.status}`);

console.log('');
console.log('── Stats (admin aggregation) ──');

r = await req('GET', '/stats/posts', null, freshAdminToken);
pass('Admin gets stats', r.status === 200 && typeof r.body.totalPosts === 'number', `total=${r.body.totalPosts} published=${r.body.publishedPosts} drafts=${r.body.draftPosts}`);
pass('Stats topAuthors populated', Array.isArray(r.body.topAuthors) && r.body.topAuthors.length > 0, `authors=${r.body.topAuthors?.map(a => a.name + ':' + a.postCount)}`);

r = await req('GET', '/stats/posts', null, authorToken);
pass('Author blocked from stats (403)', r.status === 403, `status=${r.status}`);

console.log('');
console.log('── Delete ──');

r = await req('DELETE', `/posts/${draftId}`, null, freshAdminToken);
pass('Admin deletes any post', r.status === 200, r.body.message);

r = await req('GET', `/posts/${draftId}`);
pass('Deleted post returns 404', r.status === 404, `status=${r.status}`);

console.log('\n=== DONE ===\n');
