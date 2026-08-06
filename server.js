import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBareServer } from '@tomphttp/bare-server-node';
import wisp from 'wisp-server-node';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(__dirname, '');

const app = express();
const server = createServer(app);
const bareServer = createBareServer('/bare/');
const port = process.env.PORT || 3000;

app.use(express.json());

// This tells the server to route requests for UV files to the downloaded package
app.use('/uv/', express.static(uvPath));
app.use(express.static(publicDir));

// Master Password Verification Endpoint
app.post('/api/verify', (req, res) => {
  const { password } = req.body;
  const masterPassword = process.env.SITE_MASTER_PASSWORD || 'vault2026';
  if (password === masterPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
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
  if (req.url.endsWith('/wisp/') || req.url.startsWith('/wisp')) {
    wisp.routeRequest(req, socket, head);
  } else if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
  console.log(`> THE-VAULT Engine running on port ${port}`);
});
