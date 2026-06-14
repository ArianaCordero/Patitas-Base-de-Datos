const requiredEnv = ['PG_HOST', 'PG_USER', 'PG_PASSWORD', 'PG_DATABASE', 'JWT_SECRET'];
const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length) {
  console.log(`Build step — env vars not available yet (${missing.join(', ')})`);
  process.exit(0);
}

import('./server/index.js').catch((err) => {
  console.error('Error al iniciar servidor:', err);
  process.exit(1);
});
