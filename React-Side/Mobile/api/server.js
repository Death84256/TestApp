import express from 'express';
import { Agent } from 'undici';

const app = express();
const port = Number(process.env.PORT || 3001);
const configuredBackendApiUrl = process.env.BACKEND_API_URL || 'https://localhost:44301';
const configuredBackendUrl = new URL(configuredBackendApiUrl);
const isIisExpressHttpUrl = configuredBackendUrl.protocol === 'http:'
  && configuredBackendUrl.hostname === 'localhost'
  && configuredBackendUrl.port === '64872';
const backendApiUrl = isIisExpressHttpUrl
  ? 'https://localhost:44301'
  : configuredBackendUrl.toString().replace(/\/$/, '');
const backendUrl = new URL(backendApiUrl);
const backendHostname = backendUrl.hostname.replace(/^\[|\]$/g, '');
const isLoopbackBackend = ['localhost', '127.0.0.1', '::1'].includes(backendHostname);

// IIS Express and ASP.NET dev certificates are self-signed. Only relax validation
// for HTTPS requests to this machine; remote HTTPS backends keep normal TLS checks.
const localDevelopmentDispatcher = backendUrl.protocol === 'https:' && isLoopbackBackend
  ? new Agent({ connect: { rejectUnauthorized: false } })
  : undefined;

function fetchBackend(url, options = {}) {
  return fetch(url, {
    ...options,
    ...(localDevelopmentDispatcher
      ? { dispatcher: localDevelopmentDispatcher, redirect: 'manual' }
      : {}),
  });
}

app.disable('x-powered-by');
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  next();
});
app.use(express.json({ limit: '1mb' }));

app.get('/health', async (_request, response) => {
  try {
    const backend = await fetchBackend(`${backendApiUrl}/api/account/me`, {
      signal: AbortSignal.timeout(4000),
    });
    response.json({ status: 'ok', backendReachable: true, backendStatus: backend.status });
  } catch (error) {
    console.error(`Health check could not reach C# API at ${backendApiUrl}:`, error);
    response.status(502).json({ status: 'error', backendReachable: false });
  }
});

app.use('/api', async (request, response) => {
  const targetUrl = new URL(request.originalUrl, `${backendApiUrl}/`);
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (typeof value === 'string' && !['host', 'connection', 'content-length'].includes(name)) {
      headers.set(name, value);
    }
  }

  try {
    const upstream = await fetchBackend(targetUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) || request.body === undefined
        ? undefined
        : JSON.stringify(request.body),
      signal: AbortSignal.timeout(20000),
    });

    response.status(upstream.status);
    for (const [name, value] of upstream.headers) {
      if (!['connection', 'content-encoding', 'content-length', 'transfer-encoding'].includes(name)) {
        response.setHeader(name, value);
      }
    }
    const cookies = upstream.headers.getSetCookie?.();
    if (cookies?.length) response.setHeader('set-cookie', cookies);
    response.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error(`Could not reach C# API at ${backendApiUrl}:`, error);
    response.status(502).json({ message: 'The C# API is unavailable. Check the backend service and its URL.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Mobile API proxy listening on port ${port}`);
  if (isIisExpressHttpUrl) {
    console.log('Redirected the IIS Express HTTP URL to its local HTTPS endpoint to avoid the self-signed HTTP-to-HTTPS redirect.');
  }
  console.log(`Forwarding /api requests to ${backendApiUrl}`);
});
