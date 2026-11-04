import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, process.argv[2] || '.env');
const template = readFileSync(resolve(root, '.env.example'), 'utf8');
const content = template.replace(/^([A-Z_]+)=(?:"")?$/gm, (line, name) => {
  if (name === 'JWT_SECRET') return `${name}=${randomBytes(64).toString('base64')}`;
  if ((name.endsWith('_PASSWORD') && name !== 'MAIL_PASSWORD') || name === 'INTERNAL_API_KEY') {
    return `${name}=${randomBytes(24).toString('hex')}`;
  }
  return line;
});

try {
  writeFileSync(output, content, { flag: 'wx', mode: 0o600 });
  console.log('Configuration locale créée. Aucun fichier existant écrasé.');
} catch (error) {
  if (error.code === 'EEXIST') {
    console.error('Le fichier existe déjà ; conserve ou adapte ses valeurs.');
    process.exitCode = 1;
  } else {
    throw error;
  }
}
