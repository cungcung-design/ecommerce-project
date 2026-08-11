import 'dotenv/config';

const base = 'http://localhost:5000';

const adminLoginRes = await fetch(base + '/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
});

const adminLoginData = await adminLoginRes.json();
console.log('LOGIN_STATUS', adminLoginRes.status);
console.log(JSON.stringify(adminLoginData, null, 2));

const listRes = await fetch(base + '/api/admin/categories', {
  headers: { Authorization: `Bearer ${adminLoginData.accessToken}` },
});

console.log('LIST_STATUS', listRes.status);
console.log(await listRes.text());
