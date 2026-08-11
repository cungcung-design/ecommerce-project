import http from 'node:http';

const body = JSON.stringify({ email: 'admin@example.com', password: 'admin123' });

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(data);
  });
});

req.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

req.write(body);
req.end();
