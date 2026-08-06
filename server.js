import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBareServer } from '@tomphttp/bare-server-node';
import wisp from 'wisp-server-node';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(__dirname, 'public');

const app = express();
const server = createServer();
const bareServer = createBareServer('/bare/');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(publicDir));

// Secure Password Verification (Bannana13!)
app.post('/api/verify', (req, res) => {
  const { password } = req.body;
  const masterPassword = process.env.SITE_MASTER_PASSWORD || 'Bannana13!';
  if (password === masterPassword) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(publicDir, 'index.html'));
});

server.on('request', (req, res) => {
  req.headers['x-forwarded-host'] = req.headers['host'];
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/wisp/')) {
    wisp.routeRequest(req, socket, head);
  } else if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
  console.log(`> THE-VAULT-STATIC Engine running on port ${port}`);
});
