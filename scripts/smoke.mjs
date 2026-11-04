import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';

const origin = process.env.SMOKE_ORIGIN || 'http://localhost:3000';
// Application health can precede the first Eureka registry refresh at the gateway.
for (let attempt = 0; ; attempt++) {
  try {
    const ready = await fetch(`${origin}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'missing@example.invalid', password: 'invalid' }),
      signal: AbortSignal.timeout(10000),
    });
    if ([400, 401, 403].includes(ready.status)) break;
  } catch (error) {
    if (attempt === 59) throw error;
  }
  assert.ok(attempt < 59, 'gateway discovers auth-service');
  await setTimeout(1000);
}
const frontend = await fetch(origin);
assert.equal(frontend.status, 200, 'frontend');
assert.match(await frontend.text(), /<div id="root"><\/div>/);

const route = await fetch(`${origin}/mes-trajets`);
assert.equal(route.status, 200, 'SPA navigation');
assert.match(await route.text(), /<div id="root"><\/div>/);

const protectedApi = await fetch(`${origin}/api/trajets/trips`);
assert.ok([401, 403].includes(protectedApi.status), `protected API: ${protectedApi.status}`);

const login = await fetch(`${origin}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'missing@example.invalid', password: 'invalid' }),
});
assert.ok([400, 401, 403, 404].includes(login.status), `auth route: ${login.status}`);

const users = await fetch(`${origin}/api/users/admin/users`);
assert.equal(users.status, 401, 'user administration requires authentication');

const email = `smoke-${randomUUID()}@example.test`;
const password = randomBytes(24).toString('hex');
const account = {
  email, password, username: email.split('@')[0], role: 'CLIENT',
  nom: 'Smoke', prenom: 'Test', telephone: '0600000000',
};
const post = (path, body) => fetch(`${origin}${path}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});
const escalation = await post('/api/auth/signup', { ...account, role: 'ADMIN' });
assert.equal(escalation.status, 403, 'public signup must reject administrator privileges');

const signup = await post('/api/auth/signup', account);
assert.equal(signup.status, 200, `signup: ${await signup.text()}`);
const unverified = await post('/api/auth/login', { email, password });
assert.ok([400, 403].includes(unverified.status), 'email verification is required');

const inbox = process.env.SMOKE_MAIL_ORIGIN || 'http://localhost:8025';
let code;
for (let attempt = 0; attempt < 30 && !code; attempt++) {
  const messages = await (await fetch(`${inbox}/api/v1/messages`)).json();
  const message = messages.messages.find(item => item.To?.some(to => to.Address === email));
  if (message) {
    const details = await (await fetch(`${inbox}/api/v1/message/${message.ID}`)).json();
    code = `${details.Text} ${details.HTML}`.match(/\b\d{6}\b/)?.[0];
  }
  if (!code) await setTimeout(500);
}
assert.ok(code, 'verification email received in the local SMTP inbox');
const verification = await post('/api/auth/verify', { email, verificationCode: code });
assert.equal(verification.status, 200, 'email verification');
const authenticated = await post('/api/auth/login', { email, password });
assert.equal(authenticated.status, 200, 'verified login');
const session = await authenticated.json();
assert.ok(session.token, 'JWT issued');
const headers = { Authorization: `Bearer ${session.token}` };

const profile = await fetch(`${origin}/api/users/${session.userId}`, { headers });
assert.equal(profile.status, 200, 'profile created through the authenticated internal API');
assert.equal((await profile.json()).nom, 'Smoke');
const admin = await fetch(`${origin}/api/users/admin/users`, { headers });
assert.equal(admin.status, 403, 'client cannot access administration');
const otherProfile = await fetch(`${origin}/api/users/${randomUUID()}`, { headers });
assert.equal(otherProfile.status, 403, 'client cannot access another profile');
const trips = await fetch(`${origin}/api/trajets/trips/date/${new Date().toISOString().slice(0, 10)}`, { headers });
assert.equal(trips.status, 200, `shared JWT accepted by trajet-service: ${trips.status}`);

console.log('Frontend, routing, signup, verification email, login, profile creation and access controls checked.');
